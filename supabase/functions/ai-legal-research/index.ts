
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
import { 
  analyzeLegalSemanticSimilarity,
  classifyLegalText,
  scoreInLegalBERTRelevance
} from "./inLegalBERT.ts";

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
    console.log('=== AI Legal Research with InLegalBERT Enhancement ===');
    console.log(`Query: "${query.substring(0, 50)}..."`);
    console.log(`Jurisdiction: ${jurisdiction}`);
    console.log(`Environment check:`);
    console.log(`- HUGGING_FACE_ACCESS_TOKEN exists: ${!!Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`);

    // Enhanced query analysis using InLegalBERT
    console.log('Performing InLegalBERT semantic analysis...');
    const semanticAnalysis = await classifyLegalText(query);
    console.log(`InLegalBERT Classification: ${semanticAnalysis.legalDomain} (confidence: ${semanticAnalysis.confidence})`);

    // First analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    console.log(`Analyzed domains: ${primaryDomain}, ${secondaryDomain}`);
    console.log(`InLegalBERT suggested domain: ${semanticAnalysis.legalDomain}`);

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

    // Enhanced relevance scoring using InLegalBERT
    console.log('Applying InLegalBERT relevance scoring...');
    const [enhancedPrimaryCases, enhancedSecondaryCases] = await Promise.all([
      scoreInLegalBERTRelevance(query, primaryCases),
      scoreInLegalBERTRelevance(query, secondaryCases)
    ]);

    console.log(`InLegalBERT relevance scores applied - Primary cases avg score: ${
      enhancedPrimaryCases.reduce((sum, c) => sum + (c.relevanceScore || 0), 0) / enhancedPrimaryCases.length || 0
    }`);

    // Generate system prompt for AI with real data and semantic analysis
    const enhancedSystemPrompt = buildSystemPrompt(query, primaryDomain, secondaryDomain, jurisdiction) + 
      `\n\nInLegalBERT Semantic Analysis: ${semanticAnalysis.legalDomain} (confidence: ${semanticAnalysis.confidence})` +
      `\nSemantic Segments: ${semanticAnalysis.semanticSegments.join(', ')}`;

    // Generate AI response with enhanced context from real legal datasets and InLegalBERT
    console.log('Attempting AI response generation with InLegalBERT-enhanced context...');
    const aiResponse = await generateAILegalResponse(
      query, 
      primaryDomain, 
      secondaryDomain, 
      enhancedSystemPrompt, 
      jurisdiction,
      {
        primaryCases: enhancedPrimaryCases,
        primaryStatutes,
        primaryPrinciples,
        secondaryCases: enhancedSecondaryCases,
        secondaryStatutes,
        secondaryPrinciples
      }
    );
    
    // Log the AI response status
    if (aiResponse.error) {
      console.log(`AI generation failed with error: ${aiResponse.error}`);
    } else {
      console.log('AI generation successful with InLegalBERT-enhanced dataset context');
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

    // Prepare the response data with comprehensive analysis using InLegalBERT and HuggingFace datasets
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      recommendation: aiResponse.recommendation,
      technicalDetails: aiResponse.technicalDetails,
      apiStatus,
      dataSource: "huggingface_inlegalbert",
      semanticAnalysis: {
        inLegalBERTDomain: semanticAnalysis.legalDomain,
        confidence: semanticAnalysis.confidence,
        semanticSegments: semanticAnalysis.semanticSegments
      },
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || "Analysis not available from AI model",
          principles: primaryPrinciples,
          caseExamples: enhancedPrimaryCases.map(
            (c) => `${c.title} (${c.citation}) [Relevance: ${(c.relevanceScore * 100).toFixed(1)}%]: ${c.description}`
          ),
          statutes: primaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || "Analysis not available from AI model",
          principles: secondaryPrinciples,
          caseExamples: enhancedSecondaryCases.map(
            (c) => `${c.title} (${c.citation}) [Relevance: ${(c.relevanceScore * 100).toFixed(1)}%]: ${c.description}`
          ),
          statutes: secondaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
      },
    };

    console.log('=== InLegalBERT Enhanced Response Summary ===');
    console.log(`Data Source: HuggingFace + InLegalBERT`);
    console.log(`AI Status: ${apiStatus}`);
    console.log(`InLegalBERT Domain: ${semanticAnalysis.legalDomain} (${semanticAnalysis.confidence})`);
    console.log(`Primary Analysis Length: ${aiResponse.primaryAnalysis?.length || 0}`);
    console.log(`Secondary Analysis Length: ${aiResponse.secondaryAnalysis?.length || 0}`);
    console.log(`Recommendation Length: ${aiResponse.recommendation?.length || 0}`);
    console.log(`Total Enhanced Cases: ${enhancedPrimaryCases.length + enhancedSecondaryCases.length}`);
    console.log(`Average Relevance Score: ${(
      [...enhancedPrimaryCases, ...enhancedSecondaryCases].reduce((sum, c) => sum + (c.relevanceScore || 0), 0) / 
      (enhancedPrimaryCases.length + enhancedSecondaryCases.length) || 0
    ).toFixed(3)}`);
    console.log('===============================================');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing AI legal research with InLegalBERT:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process legal query with InLegalBERT enhancement",
        details: error.message,
        apiStatus: "error",
        dataSource: "error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
