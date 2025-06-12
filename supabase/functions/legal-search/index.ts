
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { generateRecommendation, generateTechnicalDetails } from "./generateResults.ts";
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

    // Analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    // Enhanced logging for debugging
    console.log(`Processed targeted legal query: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}`);

    // Fetch targeted legal data based on query analysis
    console.log('Fetching targeted legal data for legal-search...');
    const [
      primaryCases,
      primaryStatutes,
      primaryPrinciples,
      secondaryCases,
      secondaryStatutes,
      secondaryPrinciples
    ] = await Promise.all([
      fetchTargetedCases(query, primaryDomain, jurisdiction),
      fetchTargetedStatutes(query, primaryDomain, jurisdiction),
      fetchLegalPrinciplesFromHF(primaryDomain),
      fetchTargetedCases(query, secondaryDomain, jurisdiction),
      fetchTargetedStatutes(query, secondaryDomain, jurisdiction),
      fetchLegalPrinciplesFromHF(secondaryDomain)
    ]);

    console.log(`Legal-search fetched targeted data - Primary: ${primaryCases.length} cases, ${primaryStatutes.length} statutes`);

    // Generate a recommendation based on the query and identified domains with targeted data
    const recommendation = generateTargetedRecommendation(query, primaryDomain, secondaryDomain, primaryCases, primaryStatutes);
    
    // Generate technical details for cybersecurity-related queries
    const technicalDetails = generateTechnicalDetails(primaryDomain, secondaryDomain);

    // Prepare the response data with targeted analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      recommendation,
      technicalDetails,
      dataSource: "targeted_analysis",
      comparison: {
        commonLaw: {
          analysis: `Targeted analysis of ${primaryDomain} law principles specifically addressing your query about "${query}". This analysis focuses on the most relevant legal precedents and current standards applicable to your specific situation.`,
          principles: primaryPrinciples,
          caseExamples: primaryCases.map(
            (c: any) => `${c.title} (${c.citation}): ${c.description || c.case_summary}`
          ),
          statutes: primaryStatutes.map(
            (s: any) => `${s.title} (${s.citation}): ${s.description || s.summary}`
          ),
        },
        contractLaw: {
          analysis: `Complementary analysis from ${secondaryDomain} law perspective on your query "${query}". This provides additional legal context and alternative approaches to consider in your legal matter.`,
          principles: secondaryPrinciples,
          caseExamples: secondaryCases.map(
            (c: any) => `${c.title} (${c.citation}): ${c.description || c.case_summary}`
          ),
          statutes: secondaryStatutes.map(
            (s: any) => `${s.title} (${s.citation}): ${s.description || s.summary}`
          ),
        },
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing targeted legal search:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process targeted legal search query",
        dataSource: "error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to fetch cases targeted to the specific query
async function fetchTargetedCases(query: string, domain: string, jurisdiction: string) {
  try {
    const allCases = await fetchLegalCasesFromHF(domain, jurisdiction);
    const queryKeywords = extractQueryKeywords(query);
    
    // Score and filter cases based on relevance to the query
    const scoredCases = allCases.map(case_ => {
      let score = 0;
      const caseText = `${case_.title} ${case_.description} ${case_.case_summary || ''}`.toLowerCase();
      const queryLower = query.toLowerCase();
      
      // High score for direct query substring matches
      if (caseText.includes(queryLower)) score += 10;
      
      // Medium score for keyword matches
      queryKeywords.forEach(keyword => {
        if (caseText.includes(keyword.toLowerCase())) score += 3;
      });
      
      // Bonus for title matches
      if (case_.title.toLowerCase().includes(queryLower)) score += 5;
      
      return { case: case_, score };
    });
    
    // Return top scored cases, fallback to domain cases if no matches
    const relevantCases = scoredCases
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.case);
    
    return relevantCases.length > 0 ? relevantCases : allCases.slice(0, 3);
  } catch (error) {
    console.error(`Error fetching targeted cases: ${error}`);
    return await fetchLegalCasesFromHF(domain, jurisdiction);
  }
}

// Helper function to fetch statutes targeted to the specific query
async function fetchTargetedStatutes(query: string, domain: string, jurisdiction: string) {
  try {
    const allStatutes = await fetchLegalStatutesFromHF(domain, jurisdiction);
    const queryKeywords = extractQueryKeywords(query);
    
    // Score and filter statutes based on relevance to the query
    const scoredStatutes = allStatutes.map(statute => {
      let score = 0;
      const statuteText = `${statute.title} ${statute.description} ${statute.summary || ''}`.toLowerCase();
      const queryLower = query.toLowerCase();
      
      // High score for direct query substring matches
      if (statuteText.includes(queryLower)) score += 10;
      
      // Medium score for keyword matches
      queryKeywords.forEach(keyword => {
        if (statuteText.includes(keyword.toLowerCase())) score += 3;
      });
      
      // Bonus for title matches
      if (statute.title.toLowerCase().includes(queryLower)) score += 5;
      
      return { statute, score };
    });
    
    // Return top scored statutes, fallback to domain statutes if no matches
    const relevantStatutes = scoredStatutes
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.statute);
    
    return relevantStatutes.length > 0 ? relevantStatutes : allStatutes.slice(0, 3);
  } catch (error) {
    console.error(`Error fetching targeted statutes: ${error}`);
    return await fetchLegalStatutesFromHF(domain, jurisdiction);
  }
}

// Helper function to extract meaningful keywords from user query
function extractQueryKeywords(query: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were', 'what', 'how', 'when', 'where', 'why', 'who'];
  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return [...new Set(words)];
}

// Generate targeted recommendation based on query and actual retrieved data
function generateTargetedRecommendation(query: string, primaryDomain: string, secondaryDomain: string, cases: any[], statutes: any[]): string {
  const topCase = cases[0];
  const topStatute = statutes[0];
  
  if (!topCase && !topStatute) {
    return `For your query "${query}", we recommend consulting general ${primaryDomain} law principles and seeking specific legal advice for your particular circumstances.`;
  }
  
  let recommendation = `Based on your specific query "${query}", `;
  
  if (topCase) {
    recommendation += `the most relevant precedent is ${topCase.title} (${topCase.citation}), which ${topCase.description || topCase.case_summary}. `;
  }
  
  if (topStatute) {
    recommendation += `The applicable statutory provision is the ${topStatute.title} (${topStatute.citation}), which ${topStatute.description || topStatute.summary}. `;
  }
  
  recommendation += `This analysis specifically addresses your ${primaryDomain} law inquiry and provides targeted guidance for your legal matter.`;
  
  return recommendation;
}
