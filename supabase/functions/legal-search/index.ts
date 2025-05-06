
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { generateRecommendation, generateTechnicalDetails } from "./generateResults.ts";
import { legalDataset } from "./legalDataset.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid query parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    // Enhanced logging for debugging
    console.log(`Processed legal query: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}\n`);

    // Generate a recommendation based on the query and identified domains
    const recommendation = generateRecommendation(query, primaryDomain, secondaryDomain);
    
    // Generate technical details for cybersecurity-related queries
    const technicalDetails = generateTechnicalDetails(primaryDomain, secondaryDomain);

    // Prepare the response data with comprehensive analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      recommendation,
      technicalDetails,
      comparison: {
        commonLaw: {
          analysis: legalDataset[primaryDomain].analysis,
          principles: legalDataset[primaryDomain].principles,
          caseExamples: legalDataset[primaryDomain].cases.slice(0, 3).map(
            (c: any) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: legalDataset[primaryDomain].statutes.slice(0, 2).map(
            (s: any) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: legalDataset[secondaryDomain].analysis,
          principles: legalDataset[secondaryDomain].principles,
          caseExamples: legalDataset[secondaryDomain].cases.slice(0, 3).map(
            (c: any) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: legalDataset[secondaryDomain].statutes.slice(0, 2).map(
            (s: any) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing legal search:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process legal search query" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
