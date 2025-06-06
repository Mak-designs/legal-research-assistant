
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { legalDataset } from "./legalDataset.ts";
import { findRelevantCases, findRelevantStatutes, extractRelevantPrinciples } from "./relevance.ts";
import { generateAILegalResponse } from "./openai.ts";
import { buildSystemPrompt } from "./promptBuilder.ts";

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
    console.log('=== AI Legal Research Debug Info ===');
    console.log(`Query: "${query.substring(0, 50)}..."`);
    console.log(`Jurisdiction: ${jurisdiction}`);
    console.log(`Environment check:`);
    console.log(`- HUGGING_FACE_ACCESS_TOKEN exists: ${!!Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`);
    console.log(`- Token length: ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')?.length || 0}`);
    console.log(`- Token starts with hf_: ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')?.startsWith('hf_') || false}`);

    // First analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    console.log(`Analyzed domains: ${primaryDomain}, ${secondaryDomain}`);

    // Generate system prompt for AI
    const systemPrompt = buildSystemPrompt(query, primaryDomain, secondaryDomain, jurisdiction);

    // Generate AI response with enhanced error handling
    console.log('Attempting AI response generation...');
    const aiResponse = await generateAILegalResponse(query, primaryDomain, secondaryDomain, systemPrompt, jurisdiction);
    
    // Log the AI response status
    if (aiResponse.error) {
      console.log(`AI generation failed with error: ${aiResponse.error}`);
    } else {
      console.log('AI generation successful');
    }
    
    // Extract relevant cases and statutes from our dataset based on the query
    const relevantPrimaryCases = findRelevantCases(query, legalDataset[primaryDomain].cases);
    const relevantPrimaryStatutes = findRelevantStatutes(query, legalDataset[primaryDomain].statutes);
    const relevantSecondaryStatutes = findRelevantStatutes(query, legalDataset[secondaryDomain].statutes);
    const relevantSecondaryCases = findRelevantCases(query, legalDataset[secondaryDomain].cases);

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

    // Prepare the response data with comprehensive analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      recommendation: aiResponse.recommendation,
      technicalDetails: aiResponse.technicalDetails,
      apiStatus,
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || "Analysis not available",
          principles: extractRelevantPrinciples(query, legalDataset[primaryDomain].principles),
          caseExamples: relevantPrimaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: relevantPrimaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || "Analysis not available",
          principles: extractRelevantPrinciples(query, legalDataset[secondaryDomain].principles),
          caseExamples: relevantSecondaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: relevantSecondaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
      },
    };

    console.log('=== Response Summary ===');
    console.log(`AI Status: ${apiStatus}`);
    console.log(`Primary Analysis Length: ${aiResponse.primaryAnalysis?.length || 0}`);
    console.log(`Secondary Analysis Length: ${aiResponse.secondaryAnalysis?.length || 0}`);
    console.log(`Recommendation Length: ${aiResponse.recommendation?.length || 0}`);
    console.log('============================');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing AI legal research:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process legal query",
        details: error.message,
        apiStatus: "error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
