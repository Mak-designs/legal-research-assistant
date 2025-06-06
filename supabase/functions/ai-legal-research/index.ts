
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
    console.log('=== AI Legal Research with HuggingFace Dataset ===');
    console.log(`Query: "${query.substring(0, 50)}..."`);
    console.log(`Jurisdiction: ${jurisdiction}`);
    console.log(`Environment check:`);
    console.log(`- HUGGING_FACE_ACCESS_TOKEN exists: ${!!Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`);

    // First analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    console.log(`Analyzed domains: ${primaryDomain}, ${secondaryDomain}`);

    // Fetch real legal data from Hugging Face datasets
    console.log('Fetching legal data from Hugging Face datasets...');
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

    console.log(`Fetched HF data - Primary: ${primaryCases.length} cases, ${primaryStatutes.length} statutes, ${primaryPrinciples.length} principles`);
    console.log(`Fetched HF data - Secondary: ${secondaryCases.length} cases, ${secondaryStatutes.length} statutes, ${secondaryPrinciples.length} principles`);

    // Generate system prompt for AI with real data
    const systemPrompt = buildSystemPrompt(query, primaryDomain, secondaryDomain, jurisdiction);

    // Generate AI response with enhanced context from real legal datasets
    console.log('Attempting AI response generation with HuggingFace legal context...');
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
      console.log('AI generation successful with HuggingFace dataset context');
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

    // Prepare the response data with comprehensive analysis using HuggingFace datasets
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      recommendation: aiResponse.recommendation,
      technicalDetails: aiResponse.technicalDetails,
      apiStatus,
      dataSource: "huggingface",
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || "Analysis not available from AI model",
          principles: primaryPrinciples,
          caseExamples: primaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: primaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || "Analysis not available from AI model",
          principles: secondaryPrinciples,
          caseExamples: secondaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: secondaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
      },
    };

    console.log('=== Response Summary ===');
    console.log(`Data Source: HuggingFace Datasets`);
    console.log(`AI Status: ${apiStatus}`);
    console.log(`Primary Analysis Length: ${aiResponse.primaryAnalysis?.length || 0}`);
    console.log(`Secondary Analysis Length: ${aiResponse.secondaryAnalysis?.length || 0}`);
    console.log(`Recommendation Length: ${aiResponse.recommendation?.length || 0}`);
    console.log(`Total Cases: ${primaryCases.length + secondaryCases.length}`);
    console.log(`Total Statutes: ${primaryStatutes.length + secondaryStatutes.length}`);
    console.log('============================');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing AI legal research with HuggingFace datasets:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process legal query with HuggingFace datasets",
        details: error.message,
        apiStatus: "error",
        dataSource: "error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
