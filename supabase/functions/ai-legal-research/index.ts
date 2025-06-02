
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { legalDataset } from "./legalDataset.ts";
import { findRelevantCases, findRelevantStatutes, extractRelevantPrinciples } from "./relevance.ts";
import { generateAILegalResponse } from "./openai.ts";
import { buildSystemPrompt } from "./promptBuilder.ts";
import { analyzeUserQuestion, QuestionAnalysis } from "./nlp-utils.ts";
import { performSemanticSearch, extractRelevantPassages, generateContextualAnswer } from "./semantic-search.ts";

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

    // Enhanced question analysis using NLP
    const questionAnalysis: QuestionAnalysis = analyzeUserQuestion(query);
    console.log(`Enhanced Analysis - Intent: ${questionAnalysis.intent}, Domain: ${questionAnalysis.legalDomain}, Complexity: ${questionAnalysis.complexity}`);
    console.log(`Entities found: ${questionAnalysis.entities.map(e => `${e.text} (${e.type})`).join(', ')}`);
    console.log(`Keywords: ${questionAnalysis.keywords.join(', ')}`);

    // Use enhanced analysis for domain detection, fallback to original method
    let primaryDomain = questionAnalysis.legalDomain !== 'general' ? questionAnalysis.legalDomain : null;
    let secondaryDomain = null;
    
    if (!primaryDomain) {
      [primaryDomain, secondaryDomain] = analyzeQuery(query);
    } else {
      // Get secondary domain using original method
      const [, fallbackSecondary] = analyzeQuery(query);
      secondaryDomain = fallbackSecondary;
    }
    
    console.log(`Final domains: Primary: ${primaryDomain}, Secondary: ${secondaryDomain}`);

    // Perform semantic search
    const semanticResults = performSemanticSearch(questionAnalysis, legalDataset, {
      maxResults: 8,
      minRelevanceScore: 0.5,
      prioritizeDomain: primaryDomain
    });
    
    console.log(`Semantic search found ${semanticResults.length} relevant documents`);

    // Extract relevant passages for better context
    const relevantPassages = extractRelevantPassages(semanticResults, questionAnalysis);
    
    // Generate enhanced system prompt with context
    const enhancedPrompt = buildEnhancedSystemPrompt(questionAnalysis, relevantPassages, jurisdiction);

    // Generate AI response with enhanced context
    const aiResponse = await generateAILegalResponse(query, primaryDomain, secondaryDomain, enhancedPrompt, jurisdiction);
    
    // Extract relevant cases and statutes using both original and enhanced methods
    const relevantPrimaryCases = findRelevantCases(query, legalDataset[primaryDomain].cases);
    const relevantPrimaryStatutes = findRelevantStatutes(query, legalDataset[primaryDomain].statutes);
    const relevantSecondaryStatutes = findRelevantStatutes(query, legalDataset[secondaryDomain].statutes);
    const relevantSecondaryCases = findRelevantCases(query, legalDataset[secondaryDomain].cases);

    // Generate contextual fallback answer if AI fails
    const contextualAnswer = generateContextualAnswer(questionAnalysis, semanticResults, relevantPassages);

    // Enhance the response with semantic search results
    const enhancedResponse = {
      query,
      domains: [primaryDomain, secondaryDomain],
      questionAnalysis,
      semanticResults: semanticResults.slice(0, 5), // Include top 5 semantic matches
      aiResponse: {
        ...aiResponse,
        recommendation: aiResponse.recommendation || contextualAnswer,
        primaryAnalysis: aiResponse.primaryAnalysis || generateDomainAnalysis(primaryDomain, semanticResults, questionAnalysis),
        secondaryAnalysis: aiResponse.secondaryAnalysis || generateDomainAnalysis(secondaryDomain, semanticResults, questionAnalysis)
      },
      recommendation: aiResponse.recommendation || contextualAnswer,
      technicalDetails: aiResponse.technicalDetails,
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || generateDomainAnalysis(primaryDomain, semanticResults, questionAnalysis),
          principles: extractRelevantPrinciples(query, legalDataset[primaryDomain].principles),
          caseExamples: relevantPrimaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: relevantPrimaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || generateDomainAnalysis(secondaryDomain, semanticResults, questionAnalysis),
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

    return new Response(JSON.stringify(enhancedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing enhanced AI legal research:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process legal query" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

/**
 * Build enhanced system prompt with semantic context
 */
function buildEnhancedSystemPrompt(
  questionAnalysis: QuestionAnalysis,
  relevantPassages: Array<{document: any, passage: string, relevance: number}>,
  jurisdiction: string
): string {
  let prompt = `You are an advanced legal research assistant with expertise in ${jurisdiction === 'zambian' ? 'Zambian' : 'general'} law. `;
  
  // Add intent-specific instructions
  switch (questionAnalysis.intent) {
    case 'definition':
      prompt += "The user is asking for a definition or explanation of legal concepts. Provide clear, precise definitions with legal authority. ";
      break;
    case 'requirements':
      prompt += "The user is asking about legal requirements or elements. Provide a structured list of requirements with supporting authority. ";
      break;
    case 'procedure':
      prompt += "The user is asking about legal procedures or processes. Provide step-by-step guidance with relevant legal framework. ";
      break;
    case 'comparison':
      prompt += "The user is asking for a comparison of legal concepts. Highlight similarities and differences with supporting authority. ";
      break;
    case 'application':
      prompt += "The user is asking about practical application of law. Provide practical guidance with examples and precedents. ";
      break;
  }
  
  // Add relevant context from passages
  if (relevantPassages.length > 0) {
    prompt += "\n\nRelevant legal context:\n";
    relevantPassages.slice(0, 3).forEach((passage, index) => {
      prompt += `${index + 1}. ${passage.document.title}: ${passage.passage}\n`;
    });
  }
  
  // Add domain-specific guidance
  if (questionAnalysis.legalDomain !== 'general') {
    prompt += `\nFocus your analysis on ${questionAnalysis.legalDomain} law principles and authorities. `;
  }
  
  // Add jurisdiction-specific guidance
  if (jurisdiction === 'zambian') {
    prompt += "\nEnsure your response considers Zambian statutory law, case law, and customary law where applicable. ";
  }
  
  prompt += "\n\nProvide your response in JSON format with 'recommendation', 'primaryAnalysis', 'secondaryAnalysis', and 'technicalDetails' fields.";
  
  return prompt;
}

/**
 * Generate domain-specific analysis using semantic results
 */
function generateDomainAnalysis(
  domain: string,
  semanticResults: any[],
  questionAnalysis: QuestionAnalysis
): string {
  const domainResults = semanticResults.filter(result => result.document.domain === domain);
  
  if (domainResults.length === 0) {
    return `This analysis examines the ${domain} law aspects of your inquiry. While specific authorities weren't found in our semantic search, general ${domain} law principles apply.`;
  }
  
  const topResult = domainResults[0];
  let analysis = `From a ${domain} law perspective, `;
  
  switch (questionAnalysis.intent) {
    case 'definition':
      analysis += `the concept is defined as: ${topResult.document.description}`;
      break;
    case 'requirements':
      analysis += `the key requirements include those established in ${topResult.document.title}: ${topResult.document.description}`;
      break;
    case 'procedure':
      analysis += `the procedural framework is guided by ${topResult.document.title}: ${topResult.document.description}`;
      break;
    default:
      analysis += `relevant authority includes ${topResult.document.title}: ${topResult.document.description}`;
  }
  
  if (domainResults.length > 1) {
    analysis += ` Additionally, ${domainResults[1].document.title} provides that ${domainResults[1].document.description}`;
  }
  
  return analysis;
}
