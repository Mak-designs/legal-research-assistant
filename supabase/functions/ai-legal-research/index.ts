
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { generateAILegalResponse } from "./openai.ts";
import { buildSystemPrompt } from "./promptBuilder.ts";
import { 
  fetchLegalCasesFromHF, 
  fetchLegalStatutesFromHF, 
  fetchLegalPrinciplesFromHF 
} from "./huggingFaceDataset.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, jurisdiction = "general" } = await req.json();
    
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid query parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Debug logging for environment
    console.log('=== AI Legal Research with Enhanced Query Matching ===');
    console.log(`Query: "${query.substring(0, 50)}..."`);
    console.log(`Jurisdiction: ${jurisdiction}`);

    // First analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    console.log(`Analyzed domains: ${primaryDomain}, ${secondaryDomain}`);

    // Fetch targeted legal data from database based on query analysis
    console.log('Fetching targeted legal data based on query analysis...');
    const [
      primaryCases,
      primaryStatutes,
      primaryPrinciples,
      secondaryCases,
      secondaryStatutes,
      secondaryPrinciples
    ] = await Promise.all([
      fetchTargetedCasesFromDB(query, primaryDomain, jurisdiction),
      fetchTargetedStatutesFromDB(query, primaryDomain, jurisdiction),
      fetchLegalPrinciplesFromHF(primaryDomain),
      fetchTargetedCasesFromDB(query, secondaryDomain, jurisdiction),
      fetchTargetedStatutesFromDB(query, secondaryDomain, jurisdiction),
      fetchLegalPrinciplesFromHF(secondaryDomain)
    ]);

    console.log(`Fetched targeted data - Primary: ${primaryCases.length} cases, ${primaryStatutes.length} statutes`);
    console.log(`Fetched targeted data - Secondary: ${secondaryCases.length} cases, ${secondaryStatutes.length} statutes`);

    // Generate system prompt for AI with real data
    const systemPrompt = buildSystemPrompt(query, primaryDomain, secondaryDomain, jurisdiction);

    // Generate AI response with enhanced context from targeted legal datasets
    console.log('Attempting AI response generation with targeted legal context...');
    const aiResponse = await generateAILegalResponse(
      query, 
      primaryDomain, 
      secondaryDomain, 
      systemPrompt, 
      jurisdiction,
      {
        primaryCases,
        primaryStatutes,
        primaryPrinciples,
        secondaryCases,
        secondaryStatutes,
        secondaryPrinciples
      }
    );
    
    // Log the AI response status
    if (aiResponse.error) {
      console.log(`AI generation failed with error: ${aiResponse.error}`);
    } else {
      console.log('AI generation successful with targeted dataset context');
    }

    // Determine API status for frontend display
    let apiStatus = "available";
    if (aiResponse.error) {
      switch (aiResponse.error) {
        case "invalid_token":
        case "connection_failed":
          apiStatus = "authentication_failed";
          break;
        case "rate_limit_exceeded":
          apiStatus = "quota_exceeded";
          break;
        default:
          apiStatus = "error";
      }
    }

    // Prepare the response data with targeted analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      recommendation: aiResponse.recommendation,
      technicalDetails: aiResponse.technicalDetails,
      apiStatus,
      dataSource: "targeted_database",
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || `Analysis of ${primaryDomain} law principles as they apply to your specific query`,
          principles: primaryPrinciples,
          caseExamples: primaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.case_summary || c.description}`
          ),
          statutes: primaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.summary || s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || `Analysis of ${secondaryDomain} law principles relevant to your query`,
          principles: secondaryPrinciples,
          caseExamples: secondaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.case_summary || c.description}`
          ),
          statutes: secondaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.summary || s.description}`
          ),
        },
      },
    };

    console.log('=== Enhanced Response Summary ===');
    console.log(`Data Source: Targeted Database Query`);
    console.log(`AI Status: ${apiStatus}`);
    console.log(`Query-matched Cases: ${primaryCases.length + secondaryCases.length}`);
    console.log(`Query-matched Statutes: ${primaryStatutes.length + secondaryStatutes.length}`);
    console.log('============================');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing targeted AI legal research:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process legal query with targeted matching",
        details: error.message,
        apiStatus: "error",
        dataSource: "error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to fetch targeted cases from database
async function fetchTargetedCasesFromDB(query: string, domain: string, jurisdiction: string) {
  try {
    // Extract keywords from the query for better matching
    const queryKeywords = extractQueryKeywords(query);
    console.log(`Searching cases for domain: ${domain}, keywords: ${queryKeywords.join(', ')}`);
    
    // This would normally connect to Supabase, but since we're in an edge function,
    // we'll use the HuggingFace fallback with enhanced filtering
    const allCases = await fetchLegalCasesFromHF(domain, jurisdiction);
    
    // Filter cases based on query keywords and legal domain
    const targetedCases = allCases.filter(case_ => {
      const caseText = `${case_.title} ${case_.description} ${case_.case_summary || ''}`.toLowerCase();
      const queryLower = query.toLowerCase();
      
      // Check for direct query matches
      if (caseText.includes(queryLower)) return true;
      
      // Check for keyword matches
      return queryKeywords.some(keyword => 
        caseText.includes(keyword.toLowerCase())
      );
    });
    
    // If we have targeted results, return them, otherwise return top cases for the domain
    return targetedCases.length > 0 ? targetedCases.slice(0, 5) : allCases.slice(0, 3);
  } catch (error) {
    console.error(`Error fetching targeted cases: ${error}`);
    return await fetchLegalCasesFromHF(domain, jurisdiction);
  }
}

// Helper function to fetch targeted statutes from database
async function fetchTargetedStatutesFromDB(query: string, domain: string, jurisdiction: string) {
  try {
    // Extract keywords from the query for better matching
    const queryKeywords = extractQueryKeywords(query);
    console.log(`Searching statutes for domain: ${domain}, keywords: ${queryKeywords.join(', ')}`);
    
    // This would normally connect to Supabase, but since we're in an edge function,
    // we'll use the HuggingFace fallback with enhanced filtering
    const allStatutes = await fetchLegalStatutesFromHF(domain, jurisdiction);
    
    // Filter statutes based on query keywords and legal domain
    const targetedStatutes = allStatutes.filter(statute => {
      const statuteText = `${statute.title} ${statute.description} ${statute.summary || ''}`.toLowerCase();
      const queryLower = query.toLowerCase();
      
      // Check for direct query matches
      if (statuteText.includes(queryLower)) return true;
      
      // Check for keyword matches
      return queryKeywords.some(keyword => 
        statuteText.includes(keyword.toLowerCase())
      );
    });
    
    // If we have targeted results, return them, otherwise return top statutes for the domain
    return targetedStatutes.length > 0 ? targetedStatutes.slice(0, 5) : allStatutes.slice(0, 3);
  } catch (error) {
    console.error(`Error fetching targeted statutes: ${error}`);
    return await fetchLegalStatutesFromHF(domain, jurisdiction);
  }
}

// Helper function to extract meaningful keywords from user query
function extractQueryKeywords(query: string): string[] {
  // Remove common legal stop words and extract meaningful terms
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were', 'what', 'how', 'when', 'where', 'why', 'who'];
  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Return unique words
  return [...new Set(words)];
}
