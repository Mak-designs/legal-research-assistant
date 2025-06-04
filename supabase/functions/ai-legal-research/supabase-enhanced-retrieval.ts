
// Enhanced retrieval system integrating with Supabase vector search

import { QuestionAnalysis } from './nlp-utils.ts';
import { SearchResult } from './semantic-search.ts';
import { 
  performVectorSearch, 
  performHybridVectorSearch, 
  performFallbackSearch,
  VectorSearchOptions 
} from './supabase-vector-search.ts';

export interface EnhancedRetrievalOptions {
  useVectorSearch?: boolean;
  useHybridSearch?: boolean;
  maxResults?: number;
  jurisdictionFilter?: string;
  requireCitations?: boolean;
}

/**
 * Enhanced document retrieval combining multiple Supabase search strategies
 */
export async function performEnhancedRetrieval(
  questionAnalysis: QuestionAnalysis,
  queryEmbedding: number[] | null,
  options: EnhancedRetrievalOptions = {}
): Promise<{
  results: SearchResult[];
  searchStrategy: string;
  fallbackUsed: boolean;
  metrics: any;
}> {
  const startTime = Date.now();
  const {
    useVectorSearch = true,
    useHybridSearch = true,
    maxResults = 8,
    jurisdictionFilter,
    requireCitations = false
  } = options;

  let results: SearchResult[] = [];
  let searchStrategy = 'none';
  let fallbackUsed = false;

  const vectorOptions: VectorSearchOptions = {
    maxResults,
    filterByJurisdiction: jurisdictionFilter,
    filterByType: getRelevantTypes(questionAnalysis.legalDomain),
    minSimilarity: 0.2
  };

  try {
    // Strategy 1: Hybrid search (preferred if embeddings available)
    if (useHybridSearch && queryEmbedding && queryEmbedding.length > 0) {
      console.log('Attempting hybrid vector + text search...');
      results = await performHybridVectorSearch(
        questionAnalysis.keywords.join(' '),
        queryEmbedding,
        vectorOptions
      );
      
      if (results.length > 0) {
        searchStrategy = 'hybrid';
        console.log(`Hybrid search found ${results.length} results`);
      }
    }

    // Strategy 2: Vector search only (fallback if hybrid fails)
    if (results.length === 0 && useVectorSearch && queryEmbedding) {
      console.log('Attempting vector search only...');
      results = await performVectorSearch(queryEmbedding, vectorOptions);
      
      if (results.length > 0) {
        searchStrategy = 'vector';
        console.log(`Vector search found ${results.length} results`);
      }
    }

    // Strategy 3: Keyword fallback (when vector methods fail)
    if (results.length === 0) {
      console.log('Using fallback keyword search...');
      results = await performFallbackSearch(questionAnalysis, vectorOptions);
      searchStrategy = 'fallback';
      fallbackUsed = true;
      console.log(`Fallback search found ${results.length} results`);
    }

    // Post-process results
    results = postProcessResults(results, questionAnalysis, requireCitations);

  } catch (error) {
    console.error('Enhanced retrieval failed:', error);
    
    // Emergency fallback
    results = await performFallbackSearch(questionAnalysis, vectorOptions);
    searchStrategy = 'emergency';
    fallbackUsed = true;
  }

  const metrics = {
    searchTime: Date.now() - startTime,
    resultsCount: results.length,
    avgRelevanceScore: results.length > 0 
      ? (results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length).toFixed(3)
      : 0,
    hasHighConfidenceResults: results.some(r => r.confidence > 0.7),
    topResultScore: results[0]?.relevanceScore || 0
  };

  console.log(`Enhanced retrieval completed: ${searchStrategy} strategy, ${results.length} results in ${metrics.searchTime}ms`);

  return {
    results,
    searchStrategy,
    fallbackUsed,
    metrics
  };
}

/**
 * Enhanced analysis generation using retrieved documents
 */
export function generateEnhancedAnalysis(
  retrievalData: {
    results: SearchResult[];
    searchStrategy: string;
    fallbackUsed: boolean;
    metrics: any;
  },
  questionAnalysis: QuestionAnalysis
): {
  primaryAnalysis: string;
  secondaryAnalysis: string;
  recommendationQuality: 'high' | 'medium' | 'low';
  supportingEvidence: string[];
} {
  const { results, fallbackUsed } = retrievalData;
  
  if (results.length === 0) {
    return {
      primaryAnalysis: "No specific legal authorities were found for this query. This may indicate either a very specialized area of law or a query that needs to be more specific.",
      secondaryAnalysis: "Consider refining your search terms or consulting with a legal professional for guidance on this matter.",
      recommendationQuality: 'low',
      supportingEvidence: []
    };
  }

  // Generate primary analysis from top results
  const topResults = results.slice(0, 3);
  const primaryAnalysis = generateAnalysisFromResults(
    topResults,
    questionAnalysis,
    'primary'
  );

  // Generate secondary analysis from remaining results
  const secondaryResults = results.slice(3, 6);
  const secondaryAnalysis = generateAnalysisFromResults(
    secondaryResults,
    questionAnalysis,
    'secondary'
  );

  // Determine recommendation quality
  const recommendationQuality = determineQuality(results, fallbackUsed);

  // Extract supporting evidence
  const supportingEvidence = extractSupportingEvidence(results);

  return {
    primaryAnalysis,
    secondaryAnalysis,
    recommendationQuality,
    supportingEvidence
  };
}

// Helper functions

function getRelevantTypes(legalDomain: string): string[] {
  const typeMap: Record<string, string[]> = {
    'contract': ['statute', 'case', 'principle'],
    'property': ['case', 'statute', 'regulation'],
    'tort': ['case', 'principle'],
    'criminal': ['criminal', 'case', 'statute'],
    'constitutional': ['constitutional', 'case'],
    'cyberSecurity': ['cyber', 'statute', 'regulation']
  };
  
  return typeMap[legalDomain] || ['case', 'statute', 'principle'];
}

function postProcessResults(
  results: SearchResult[],
  questionAnalysis: QuestionAnalysis,
  requireCitations: boolean
): SearchResult[] {
  let processed = results;

  // Filter by citation requirement
  if (requireCitations) {
    processed = processed.filter(result => 
      result.document.citation && result.document.citation.length > 0
    );
  }

  // Boost relevance for intent-specific matches
  processed = processed.map(result => {
    let boost = 0;
    
    // Intent-based boosting
    switch (questionAnalysis.intent) {
      case 'definition':
        if (result.document.description.toLowerCase().includes('means') ||
            result.document.description.toLowerCase().includes('defined')) {
          boost += 0.2;
        }
        break;
      case 'requirements':
        if (result.document.description.toLowerCase().includes('shall') ||
            result.document.description.toLowerCase().includes('must')) {
          boost += 0.2;
        }
        break;
      case 'penalties':
        if (result.document.description.toLowerCase().includes('penalty') ||
            result.document.description.toLowerCase().includes('fine')) {
          boost += 0.2;
        }
        break;
    }

    return {
      ...result,
      relevanceScore: Math.min(1.0, result.relevanceScore + boost)
    };
  });

  // Re-sort after boosting
  return processed.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function generateAnalysisFromResults(
  results: SearchResult[],
  questionAnalysis: QuestionAnalysis,
  analysisType: 'primary' | 'secondary'
): string {
  if (results.length === 0) {
    return analysisType === 'primary' 
      ? "No primary legal authorities found for this aspect of the query."
      : "No additional supporting authorities identified.";
  }

  const topResult = results[0];
  let analysis = `Based on ${topResult.document.title}`;
  
  if (topResult.document.citation) {
    analysis += ` (${topResult.document.citation})`;
  }
  
  analysis += `: ${topResult.document.description}`;

  // Add additional context from other results
  if (results.length > 1) {
    const additionalSources = results.slice(1, 3)
      .map(r => r.document.title)
      .join(', ');
    
    analysis += ` This is further supported by authorities including ${additionalSources}.`;
  }

  return analysis;
}

function determineQuality(
  results: SearchResult[],
  fallbackUsed: boolean
): 'high' | 'medium' | 'low' {
  if (fallbackUsed || results.length === 0) {
    return 'low';
  }
  
  const avgScore = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
  const hasCitations = results.some(r => r.document.citation);
  
  if (avgScore > 0.7 && hasCitations && results.length >= 3) {
    return 'high';
  } else if (avgScore > 0.4 && results.length >= 2) {
    return 'medium';
  } else {
    return 'low';
  }
}

function extractSupportingEvidence(results: SearchResult[]): string[] {
  return results
    .filter(r => r.document.citation)
    .slice(0, 5)
    .map(r => `${r.document.title} (${r.document.citation})`);
}
