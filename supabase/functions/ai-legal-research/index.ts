
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "./analyzeQuery.ts";
import { legalDataset } from "./legalDataset.ts";
import { findRelevantCases, findRelevantStatutes, extractRelevantPrinciples } from "./relevance.ts";
import { generateImprovedLegalResponse } from "./improved-openai.ts";
import { buildSystemPrompt } from "./promptBuilder.ts";
import { analyzeUserQuestion, QuestionAnalysis } from "./nlp-utils.ts";
import { performSemanticSearch, extractRelevantPassages, generateContextualAnswer } from "./semantic-search.ts";
import { extractComparisonCriteria, generateComparisonPrompt } from "./comparison-analyzer.ts";
import { retrieveComparisonDocuments, mergeComparisonResults } from "./dynamic-retrieval.ts";
import { performHybridSearch } from "./hybrid-search.ts";
import { performEnhancedRetrieval, generateEnhancedAnalysis } from "./supabase-enhanced-retrieval.ts";

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

    // Determine relevant domains based on query analysis
    const relevantDomains = determineRelevantDomains(questionAnalysis, comparisonCriteria);
    const primaryDomain = relevantDomains.primary;
    const secondaryDomain = relevantDomains.secondary;
    
    console.log(`Final domains: Primary: ${primaryDomain}, Secondary: ${secondaryDomain}`);

    // Try enhanced Supabase retrieval first
    let enhancedRetrievalData;
    let allRelevantDocs: any[] = [];
    let usingSupabaseSearch = false;

    try {
      // Attempt to generate query embedding (this would normally use OpenAI)
      let queryEmbedding: number[] | null = null;
      
      // For now, we'll simulate embedding generation or skip if not available
      // In production, you'd call OpenAI embeddings API here
      
      enhancedRetrievalData = await performEnhancedRetrieval(
        questionAnalysis,
        queryEmbedding,
        {
          useVectorSearch: true,
          useHybridSearch: true,
          maxResults: 8,
          jurisdictionFilter: jurisdiction !== "general" ? jurisdiction : undefined,
          requireCitations: true
        }
      );

      if (enhancedRetrievalData.results.length > 0) {
        allRelevantDocs = enhancedRetrievalData.results;
        usingSupabaseSearch = true;
        console.log(`Supabase enhanced search: ${enhancedRetrievalData.searchStrategy} strategy found ${allRelevantDocs.length} documents`);
      }
    } catch (supabaseError) {
      console.error('Supabase enhanced retrieval failed:', supabaseError);
    }

    // Fallback to hybrid search if Supabase search fails or returns no results
    if (!usingSupabaseSearch || allRelevantDocs.length === 0) {
      console.log('Using fallback hybrid search...');
      
      const hybridResults = performHybridSearch(questionAnalysis, legalDataset, {
        semanticWeight: 0.7,
        keywordWeight: 0.3,
        maxResults: 8,
        minRelevanceScore: 0.3
      });
      
      console.log(`Hybrid search found ${hybridResults.length} relevant documents`);

      // Retrieve documents for dynamic comparison (backup approach)
      const comparisonDocuments = retrieveComparisonDocuments(
        comparisonCriteria,
        questionAnalysis,
        legalDataset
      );
      
      // Merge and rank all relevant documents
      const mergedDocuments = mergeComparisonResults(comparisonDocuments);
      
      // Combine both retrieval approaches and deduplicate
      allRelevantDocs = [...hybridResults, ...mergedDocuments]
        .filter((doc, index, self) => 
          index === self.findIndex(d => d.document.title === doc.document.title)
        )
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 8);

      console.log(`Final document set: ${allRelevantDocs.length} documents after deduplication`);
    }

    // Extract relevant passages for better context
    const relevantPassages = extractRelevantPassages(allRelevantDocs, questionAnalysis);
    
    // Generate dynamic comparison prompt
    const comparisonPrompt = generateComparisonPrompt(
      comparisonCriteria,
      query,
      allRelevantDocs.map(result => result.document)
    );

    // Prepare context for improved AI response
    const promptContext = {
      query,
      retrievedDocuments: allRelevantDocs,
      jurisdiction,
      legalDomain: primaryDomain || 'general',
      questionAnalysis
    };

    // Generate AI response with enhanced context and validation
    let aiResponse;
    let apiStatus: "available" | "quota_exceeded" | "error" | null = null;
    
    try {
      aiResponse = await generateImprovedLegalResponse(promptContext);
      apiStatus = "available";
    } catch (error) {
      console.error('AI response generation failed:', error);
      apiStatus = "error";
      
      // Generate fallback analysis using enhanced retrieval if available
      if (usingSupabaseSearch && enhancedRetrievalData) {
        const enhancedAnalysis = generateEnhancedAnalysis(enhancedRetrievalData, questionAnalysis);
        aiResponse = {
          recommendation: enhancedAnalysis.primaryAnalysis,
          primaryAnalysis: enhancedAnalysis.primaryAnalysis,
          secondaryAnalysis: enhancedAnalysis.secondaryAnalysis,
          supportingEvidence: enhancedAnalysis.supportingEvidence,
          quality: enhancedAnalysis.recommendationQuality
        };
      } else {
        // Generate contextual fallback answer
        const contextualAnswer = generateContextualAnswer(questionAnalysis, allRelevantDocs, relevantPassages);
        aiResponse = {
          recommendation: contextualAnswer,
          primaryAnalysis: contextualAnswer,
          secondaryAnalysis: "Additional legal research may be required for comprehensive analysis."
        };
      }
    }
    
    // Extract relevant cases and statutes only from relevant domains
    const relevantPrimaryCases = primaryDomain && legalDataset[primaryDomain] ? 
      findRelevantCases(query, legalDataset[primaryDomain].cases) : [];
    const relevantPrimaryStatutes = primaryDomain && legalDataset[primaryDomain] ? 
      findRelevantStatutes(query, legalDataset[primaryDomain].statutes) : [];
    const relevantSecondaryCases = secondaryDomain && legalDataset[secondaryDomain] ? 
      findRelevantCases(query, legalDataset[secondaryDomain].cases) : [];
    const relevantSecondaryStatutes = secondaryDomain && legalDataset[secondaryDomain] ? 
      findRelevantStatutes(query, legalDataset[secondaryDomain].statutes) : [];

    // Generate dynamic comparison analysis
    const dynamicComparison = generateDynamicComparison(
      comparisonCriteria,
      allRelevantDocs,
      questionAnalysis
    );

    // Enhance the response with improved retrieval and validation
    const enhancedResponse = {
      query,
      domains: [primaryDomain, secondaryDomain].filter(d => d),
      questionAnalysis,
      comparisonCriteria,
      retrievalMetrics: usingSupabaseSearch ? {
        searchStrategy: enhancedRetrievalData!.searchStrategy,
        fallbackUsed: enhancedRetrievalData!.fallbackUsed,
        supabaseMetrics: enhancedRetrievalData!.metrics,
        finalDocs: allRelevantDocs.length,
        avgRelevanceScore: allRelevantDocs.length > 0 
          ? (allRelevantDocs.reduce((sum, doc) => sum + doc.relevanceScore, 0) / allRelevantDocs.length).toFixed(3)
          : 0
      } : {
        hybridResults: allRelevantDocs.length,
        finalDocs: allRelevantDocs.length,
        avgRelevanceScore: allRelevantDocs.length > 0 
          ? (allRelevantDocs.reduce((sum, doc) => sum + doc.relevanceScore, 0) / allRelevantDocs.length).toFixed(3)
          : 0,
        fallbackUsed: !usingSupabaseSearch
      },
      dynamicDocuments: allRelevantDocs.slice(0, 5),
      aiResponse: {
        ...aiResponse,
        recommendation: aiResponse.recommendation || dynamicComparison.primaryAnalysis,
        primaryAnalysis: aiResponse.primaryAnalysis || dynamicComparison.primaryAnalysis,
        secondaryAnalysis: aiResponse.secondaryAnalysis || dynamicComparison.secondaryAnalysis,
        apiStatus
      },
      recommendation: aiResponse.recommendation || dynamicComparison.primaryAnalysis,
      technicalDetails: aiResponse.technicalDetails,
      comparison: buildComparisonResponse(
        primaryDomain, 
        secondaryDomain, 
        aiResponse, 
        dynamicComparison,
        relevantPrimaryCases,
        relevantPrimaryStatutes,
        relevantSecondaryCases,
        relevantSecondaryStatutes,
        query
      ),
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
 * Determine relevant domains based on query analysis and comparison criteria
 */
function determineRelevantDomains(questionAnalysis: QuestionAnalysis, comparisonCriteria: any) {
  const queryLower = comparisonCriteria.primaryQuery.toLowerCase();
  
  // For specific doctrines, return focused domains
  if (queryLower.includes('estoppel')) {
    return { primary: 'contract', secondary: null }; // Estoppel is primarily contract-related
  }
  
  if (queryLower.includes('adverse possession')) {
    return { primary: 'property', secondary: null };
  }
  
  if (queryLower.includes('force majeure')) {
    return { primary: 'contract', secondary: null };
  }
  
  if (queryLower.includes('elements') && queryLower.includes('contract')) {
    return { primary: 'contract', secondary: null };
  }
  
  // Use enhanced analysis for domain detection
  let primaryDomain = questionAnalysis.legalDomain !== 'general' ? questionAnalysis.legalDomain : null;
  let secondaryDomain = null;
  
  // Fallback to original method if needed
  if (!primaryDomain || primaryDomain === 'general') {
    const [fallbackPrimary, fallbackSecondary] = analyzeQuery(comparisonCriteria.primaryQuery);
    primaryDomain = fallbackPrimary;
    secondaryDomain = fallbackSecondary;
  }
  
  // Override with comparison criteria if more specific
  if (comparisonCriteria.legalDomains.length > 0) {
    primaryDomain = comparisonCriteria.legalDomains[0];
    secondaryDomain = comparisonCriteria.legalDomains[1] || null;
  }
  
  return { primary: primaryDomain, secondary: secondaryDomain };
}

/**
 * Build comparison response structure based on relevant domains only
 */
function buildComparisonResponse(
  primaryDomain: string | null,
  secondaryDomain: string | null,
  aiResponse: any,
  dynamicComparison: any,
  relevantPrimaryCases: any[],
  relevantPrimaryStatutes: any[],
  relevantSecondaryCases: any[],
  relevantSecondaryStatutes: any[],
  query: string
) {
  const comparison: any = {};
  
  // Only include primary domain analysis if it exists and is relevant
  if (primaryDomain && legalDataset[primaryDomain]) {
    comparison.commonLaw = {
      analysis: aiResponse.primaryAnalysis || dynamicComparison.primaryAnalysis,
      principles: extractRelevantPrinciples(query, legalDataset[primaryDomain].principles),
      caseExamples: relevantPrimaryCases.map(
        (c) => `${c.title} (${c.citation}): ${c.description}`
      ),
      statutes: relevantPrimaryStatutes.map(
        (s) => `${s.title} (${s.citation}): ${s.description}`
      ),
    };
  }
  
  // Only include secondary domain analysis if it exists, is different from primary, and is relevant
  if (secondaryDomain && secondaryDomain !== primaryDomain && legalDataset[secondaryDomain]) {
    comparison.contractLaw = {
      analysis: aiResponse.secondaryAnalysis || dynamicComparison.secondaryAnalysis,
      principles: extractRelevantPrinciples(query, legalDataset[secondaryDomain].principles),
      caseExamples: relevantSecondaryCases.map(
        (c) => `${c.title} (${c.citation}): ${c.description}`
      ),
      statutes: relevantSecondaryStatutes.map(
        (s) => `${s.title} (${s.citation}): ${s.description}`
      ),
    };
  }
  
  return comparison;
}

/**
 * Generate dynamic comparison analysis based on retrieved documents
 */
function generateDynamicComparison(
  criteria: any,
  documents: any[],
  questionAnalysis: QuestionAnalysis
): { primaryAnalysis: string; secondaryAnalysis: string } {
  
  // Group documents by context
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
  
  const queryLower = criteria.primaryQuery.toLowerCase();
  
  documents.forEach(doc => {
    const docText = `${doc.document.title} ${doc.document.description}`.toLowerCase();
    
    // For specific doctrines, group by relevance to that doctrine
    if (queryLower.includes('estoppel')) {
      if (docText.includes('estoppel') || docText.includes('promissory') || docText.includes('representation')) {
        primary.push(doc);
      } else {
        secondary.push(doc);
      }
      return;
    }
    
    if (queryLower.includes('adverse possession')) {
      if (docText.includes('adverse possession') || docText.includes('possession')) {
        primary.push(doc);
      } else {
        secondary.push(doc);
      }
      return;
    }
    
    // Default grouping by jurisdiction or domain
    if (criteria.jurisdictions.length > 1) {
      const docJurisdiction = doc.document.comparisonJurisdiction || 
                             determineDocumentJurisdiction(doc.document);
      
      if (docJurisdiction === criteria.jurisdictions[0]) {
        primary.push(doc);
      } else {
        secondary.push(doc);
      }
    } else {
      // Split documents evenly
      const midpoint = Math.ceil(documents.length / 2);
      if (documents.indexOf(doc) < midpoint) {
        primary.push(doc);
      } else {
        secondary.push(doc);
      }
    }
  });
  
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
