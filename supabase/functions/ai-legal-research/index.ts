
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { legalDataset } from "./legalDataset.ts";
import { findRelevantCases, findRelevantStatutes, extractRelevantPrinciples } from "./relevance.ts";
import { generateAILegalResponse } from "./openai.ts";
import { buildSystemPrompt } from "./promptBuilder.ts";
import { analyzeUserQuestion, QuestionAnalysis } from "./nlp-utils.ts";
import { performSemanticSearch, extractRelevantPassages, generateContextualAnswer } from "./semantic-search.ts";
import { extractComparisonCriteria, generateComparisonPrompt } from "./comparison-analyzer.ts";
import { retrieveComparisonDocuments, mergeComparisonResults } from "./dynamic-retrieval.ts";

serve(async (req) => {
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

    // Extract comparison criteria for dynamic analysis
    const comparisonCriteria = extractComparisonCriteria(query);
    console.log(`Comparison Analysis - Jurisdictions: ${comparisonCriteria.jurisdictions.join(', ')}, Topics: ${comparisonCriteria.topics.join(', ')}, Type: ${comparisonCriteria.comparisonType}`);

    // Use enhanced analysis for domain detection, fallback to original method
    let primaryDomain = questionAnalysis.legalDomain !== 'general' ? questionAnalysis.legalDomain : null;
    let secondaryDomain = null;
    
    if (!primaryDomain) {
      [primaryDomain, secondaryDomain] = analyzeQuery(query);
    } else {
      const [, fallbackSecondary] = analyzeQuery(query);
      secondaryDomain = fallbackSecondary;
    }
    
    // Override domains with comparison criteria if more specific
    if (comparisonCriteria.legalDomains.length > 0) {
      primaryDomain = comparisonCriteria.legalDomains[0];
      secondaryDomain = comparisonCriteria.legalDomains[1] || secondaryDomain;
    }
    
    console.log(`Final domains: Primary: ${primaryDomain}, Secondary: ${secondaryDomain}`);

    // Retrieve documents for dynamic comparison
    const comparisonDocuments = retrieveComparisonDocuments(
      comparisonCriteria,
      questionAnalysis,
      legalDataset
    );
    
    // Merge and rank all relevant documents
    const mergedDocuments = mergeComparisonResults(comparisonDocuments);
    console.log(`Dynamic retrieval found ${mergedDocuments.length} relevant documents across ${comparisonDocuments.length} jurisdiction-topic combinations`);

    // Perform additional semantic search for comprehensive coverage
    const semanticResults = performSemanticSearch(questionAnalysis, legalDataset, {
      maxResults: 8,
      minRelevanceScore: 0.3,
      prioritizeDomain: primaryDomain
    });
    
    // Combine both retrieval approaches
    const allRelevantDocs = [...mergedDocuments, ...semanticResults]
      .filter((doc, index, self) => 
        index === self.findIndex(d => d.document.title === doc.document.title)
      )
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    // Extract relevant passages for better context
    const relevantPassages = extractRelevantPassages(allRelevantDocs, questionAnalysis);
    
    // Generate dynamic comparison prompt
    const comparisonPrompt = generateComparisonPrompt(
      comparisonCriteria,
      query,
      allRelevantDocs.map(result => result.document)
    );

    // Generate AI response with enhanced context
    const aiResponse = await generateAILegalResponse(
      query, 
      primaryDomain, 
      secondaryDomain, 
      comparisonPrompt, 
      jurisdiction
    );
    
    // Extract relevant cases and statutes using both original and enhanced methods
    const relevantPrimaryCases = findRelevantCases(query, legalDataset[primaryDomain].cases);
    const relevantPrimaryStatutes = findRelevantStatutes(query, legalDataset[primaryDomain].statutes);
    const relevantSecondaryStatutes = findRelevantStatutes(query, legalDataset[secondaryDomain].statutes);
    const relevantSecondaryCases = findRelevantCases(query, legalDataset[secondaryDomain].cases);

    // Generate contextual fallback answer if AI fails
    const contextualAnswer = generateContextualAnswer(questionAnalysis, allRelevantDocs, relevantPassages);

    // Generate dynamic comparison analysis
    const dynamicComparison = generateDynamicComparison(
      comparisonCriteria,
      allRelevantDocs,
      questionAnalysis
    );

    // Enhance the response with dynamic comparison results
    const enhancedResponse = {
      query,
      domains: [primaryDomain, secondaryDomain],
      questionAnalysis,
      comparisonCriteria,
      dynamicDocuments: allRelevantDocs.slice(0, 5),
      aiResponse: {
        ...aiResponse,
        recommendation: aiResponse.recommendation || contextualAnswer,
        primaryAnalysis: aiResponse.primaryAnalysis || dynamicComparison.primaryAnalysis,
        secondaryAnalysis: aiResponse.secondaryAnalysis || dynamicComparison.secondaryAnalysis
      },
      recommendation: aiResponse.recommendation || contextualAnswer,
      technicalDetails: aiResponse.technicalDetails,
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || dynamicComparison.primaryAnalysis,
          principles: extractRelevantPrinciples(query, legalDataset[primaryDomain].principles),
          caseExamples: relevantPrimaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: relevantPrimaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || dynamicComparison.secondaryAnalysis,
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
 * Generate dynamic comparison analysis based on retrieved documents
 */
function generateDynamicComparison(
  criteria: any,
  documents: any[],
  questionAnalysis: QuestionAnalysis
): { primaryAnalysis: string; secondaryAnalysis: string } {
  
  // Group documents by jurisdiction or domain
  const groupedDocs = groupDocumentsByContext(documents, criteria);
  
  const primaryAnalysis = generateAnalysisForGroup(
    groupedDocs.primary,
    criteria.comparisonType,
    questionAnalysis,
    'primary'
  );
  
  const secondaryAnalysis = generateAnalysisForGroup(
    groupedDocs.secondary,
    criteria.comparisonType,
    questionAnalysis,
    'secondary'
  );
  
  return { primaryAnalysis, secondaryAnalysis };
}

function groupDocumentsByContext(documents: any[], criteria: any) {
  const primary: any[] = [];
  const secondary: any[] = [];
  
  documents.forEach(doc => {
    // Group by jurisdiction if comparing jurisdictions
    if (criteria.jurisdictions.length > 1) {
      const docJurisdiction = doc.document.comparisonJurisdiction || 
                             determineDocumentJurisdiction(doc.document);
      
      if (docJurisdiction === criteria.jurisdictions[0]) {
        primary.push(doc);
      } else {
        secondary.push(doc);
      }
    } else {
      // Group by domain/topic
      const docDomain = doc.document.domain || doc.document.comparisonTopic;
      
      if (criteria.legalDomains.includes(docDomain)) {
        primary.push(doc);
      } else {
        secondary.push(doc);
      }
    }
  });
  
  // If grouping didn't work well, split documents evenly
  if (primary.length === 0 && secondary.length === 0) {
    const midpoint = Math.ceil(documents.length / 2);
    return {
      primary: documents.slice(0, midpoint),
      secondary: documents.slice(midpoint)
    };
  }
  
  return { primary, secondary };
}

function determineDocumentJurisdiction(document: any): string {
  const text = `${document.title} ${document.description}`.toLowerCase();
  
  if (text.includes('zambia') || text.includes('zambian')) return 'zambian';
  if (text.includes('united states') || text.includes('usa')) return 'usa';
  if (text.includes('uk') || text.includes('british')) return 'uk';
  
  return 'general';
}

function generateAnalysisForGroup(
  documents: any[],
  comparisonType: string,
  questionAnalysis: QuestionAnalysis,
  groupType: 'primary' | 'secondary'
): string {
  if (documents.length === 0) {
    return `No specific ${groupType} legal authorities were found for this aspect of your query. This may indicate a gap in coverage or that the legal principles are primarily addressed in other jurisdictions or legal domains.`;
  }
  
  const topDoc = documents[0];
  let analysis = `Based on the relevant legal authorities, `;
  
  switch (comparisonType) {
    case 'definition':
      analysis += `the legal definition is established in ${topDoc.document.title}: ${topDoc.document.description}`;
      break;
    case 'penalties':
      analysis += `the penalty structure is outlined in ${topDoc.document.title}: ${topDoc.document.description}`;
      break;
    case 'procedures':
      analysis += `the procedural requirements are detailed in ${topDoc.document.title}: ${topDoc.document.description}`;
      break;
    case 'scope':
      analysis += `the scope of application is defined in ${topDoc.document.title}: ${topDoc.document.description}`;
      break;
    case 'enforcement':
      analysis += `the enforcement mechanisms are described in ${topDoc.document.title}: ${topDoc.document.description}`;
      break;
    default:
      analysis += `the legal framework is established in ${topDoc.document.title}: ${topDoc.document.description}`;
  }
  
  // Add additional context from other documents
  if (documents.length > 1) {
    analysis += ` Additionally, ${documents[1].document.title} provides that ${documents[1].document.description}`;
  }
  
  return analysis;
}
