
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

    // First analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    // Enhanced logging for debugging
    console.log(`AI Legal Research: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}\n`);

    // Generate system prompt for OpenAI
    const systemPrompt = buildSystemPrompt(query, primaryDomain, secondaryDomain, jurisdiction);

    // Generate AI response
    const aiResponse = await generateAILegalResponse(query, primaryDomain, secondaryDomain, systemPrompt, jurisdiction);
    
    // Extract relevant cases and statutes from our dataset based on the query
    const relevantPrimaryCases = findRelevantCases(query, legalDataset[primaryDomain].cases);
    const relevantPrimaryStatutes = findRelevantStatutes(query, legalDataset[primaryDomain].statutes);
    const relevantSecondaryStatutes = findRelevantStatutes(query, legalDataset[secondaryDomain].statutes);
    const relevantSecondaryCases = findRelevantCases(query, legalDataset[secondaryDomain].cases);

    // Prepare the response data with comprehensive analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      recommendation: aiResponse.recommendation,
      technicalDetails: aiResponse.technicalDetails,
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

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing AI legal research:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process legal query" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
