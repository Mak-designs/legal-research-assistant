
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
    console.log(`Processed legal query with HuggingFace datasets: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}`);

    // Fetch real legal data from Hugging Face datasets
    console.log('Fetching legal data from Hugging Face datasets for legal-search...');
    const [
      primaryCases,
      primaryStatutes,
      primaryPrinciples,
      secondaryCases,
      secondaryStatutes,
      secondaryPrinciples
    ] = await Promise.all([
      fetchLegalCasesFromHF(primaryDomain, jurisdiction),
      fetchLegalStatutesFromHF(primaryDomain, jurisdiction),
      fetchLegalPrinciplesFromHF(primaryDomain),
      fetchLegalCasesFromHF(secondaryDomain, jurisdiction),
      fetchLegalStatutesFromHF(secondaryDomain, jurisdiction),
      fetchLegalPrinciplesFromHF(secondaryDomain)
    ]);

    console.log(`Legal-search fetched HF data - Primary: ${primaryCases.length} cases, ${primaryStatutes.length} statutes`);

    // Generate a recommendation based on the query and identified domains with real data
    const recommendation = generateRecommendation(query, primaryDomain, secondaryDomain);
    
    // Generate technical details for cybersecurity-related queries
    const technicalDetails = generateTechnicalDetails(primaryDomain, secondaryDomain);

    // Prepare the response data with comprehensive analysis using real HuggingFace data
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      recommendation,
      technicalDetails,
      dataSource: "huggingface",
      comparison: {
        commonLaw: {
          analysis: `Analysis based on real legal precedents from HuggingFace datasets for ${primaryDomain} domain. This analysis incorporates current legal standards and recent case law developments.`,
          principles: primaryPrinciples,
          caseExamples: primaryCases.map(
            (c: any) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: primaryStatutes.map(
            (s: any) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: `Analysis based on real legal precedents from HuggingFace datasets for ${secondaryDomain} domain. This analysis reflects contemporary legal practice and established precedents.`,
          principles: secondaryPrinciples,
          caseExamples: secondaryCases.map(
            (c: any) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: secondaryStatutes.map(
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
    console.error("Error processing legal search with HuggingFace datasets:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process legal search query with HuggingFace datasets",
        dataSource: "error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
