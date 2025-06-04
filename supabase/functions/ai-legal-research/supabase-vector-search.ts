
// Enhanced Supabase vector search with pgvector integration

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { SearchResult } from './semantic-search.ts';
import { QuestionAnalysis } from './nlp-utils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface VectorSearchOptions {
  maxResults?: number;
  minSimilarity?: number;
  filterByType?: string[];
  filterByJurisdiction?: string;
  hybridSearch?: boolean;
}

export interface LegalChunk {
  id: string;
  content: string;
  embedding?: number[];
  title: string;
  type: string; // 'statute', 'case', 'principle', etc.
  jurisdiction: string;
  section?: string;
  citation?: string;
  similarity?: number;
  rank?: number;
}

/**
 * Perform vector search using Supabase pgvector
 */
export async function performVectorSearch(
  queryEmbedding: number[],
  options: VectorSearchOptions = {}
): Promise<SearchResult[]> {
  const {
    maxResults = 8,
    minSimilarity = 0.3,
    filterByType,
    filterByJurisdiction,
    hybridSearch = false
  } = options;

  try {
    let query = supabase
      .from('legal_chunks')
      .select('id, content, title, type, jurisdiction, section, citation')
      .order('embedding', { ascending: false }) // pgvector similarity
      .limit(maxResults);

    // Apply filters if specified
    if (filterByType && filterByType.length > 0) {
      query = query.in('type', filterByType);
    }

    if (filterByJurisdiction) {
      query = query.eq('jurisdiction', filterByJurisdiction);
    }

    // Execute vector search query
    const { data, error } = await query;

    if (error) {
      console.error('Vector search error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No vector search results found');
      return [];
    }

    // Convert to SearchResult format
    const results: SearchResult[] = data.map((chunk: any, index: number) => ({
      document: {
        title: chunk.title,
        description: chunk.content,
        citation: chunk.citation || '',
        type: chunk.type,
        domain: mapTypeToLegalDomain(chunk.type),
        jurisdiction: chunk.jurisdiction,
        section: chunk.section
      },
      relevanceScore: calculateVectorRelevanceScore(index, data.length),
      matchedConcepts: extractMatchedConcepts(chunk.content, queryEmbedding),
      confidence: Math.max(0.1, 1 - (index * 0.1))
    }));

    return results.filter(result => result.relevanceScore >= minSimilarity);
  } catch (error) {
    console.error('Vector search failed:', error);
    return [];
  }
}

/**
 * Perform hybrid search combining vector and full-text search
 */
export async function performHybridVectorSearch(
  queryText: string,
  queryEmbedding: number[],
  options: VectorSearchOptions = {}
): Promise<SearchResult[]> {
  const {
    maxResults = 8,
    filterByType,
    filterByJurisdiction
  } = options;

  try {
    // Perform full-text search
    let ftsQuery = supabase
      .from('legal_chunks')
      .select('id, content, title, type, jurisdiction, section, citation')
      .textSearch('content', queryText, {
        type: 'websearch',
        config: 'english'
      })
      .limit(maxResults);

    // Apply same filters
    if (filterByType && filterByType.length > 0) {
      ftsQuery = ftsQuery.in('type', filterByType);
    }

    if (filterByJurisdiction) {
      ftsQuery = ftsQuery.eq('jurisdiction', filterByJurisdiction);
    }

    const { data: ftsData, error: ftsError } = await ftsQuery;
    
    if (ftsError) {
      console.error('Full-text search error:', ftsError);
    }

    // Perform vector search
    const vectorResults = await performVectorSearch(queryEmbedding, options);

    // Combine and deduplicate results
    const combinedResults = combineHybridResults(
      ftsData || [],
      vectorResults,
      queryText
    );

    return combinedResults.slice(0, maxResults);
  } catch (error) {
    console.error('Hybrid search failed:', error);
    // Fallback to vector search only
    return await performVectorSearch(queryEmbedding, options);
  }
}

/**
 * Enhanced fallback search when primary methods fail
 */
export async function performFallbackSearch(
  questionAnalysis: QuestionAnalysis,
  options: VectorSearchOptions = {}
): Promise<SearchResult[]> {
  const searchTerms = questionAnalysis.keywords.join(' ');
  
  try {
    // Try keyword-based search without embeddings
    let fallbackQuery = supabase
      .from('legal_chunks')
      .select('id, content, title, type, jurisdiction, section, citation')
      .or(`content.ilike.%${searchTerms}%, title.ilike.%${searchTerms}%`)
      .limit(options.maxResults || 5);

    // Apply domain-specific filters
    if (questionAnalysis.legalDomain !== 'general') {
      const domainTypes = mapLegalDomainToTypes(questionAnalysis.legalDomain);
      if (domainTypes.length > 0) {
        fallbackQuery = fallbackQuery.in('type', domainTypes);
      }
    }

    const { data, error } = await fallbackQuery;

    if (error) {
      console.error('Fallback search error:', error);
      return generateEmergencyFallback(questionAnalysis);
    }

    if (!data || data.length === 0) {
      return generateEmergencyFallback(questionAnalysis);
    }

    // Convert to SearchResult format
    return data.map((chunk: any, index: number) => ({
      document: {
        title: chunk.title,
        description: chunk.content,
        citation: chunk.citation || '',
        type: chunk.type,
        domain: mapTypeToLegalDomain(chunk.type),
        jurisdiction: chunk.jurisdiction,
        section: chunk.section
      },
      relevanceScore: Math.max(0.2, 0.8 - (index * 0.1)),
      matchedConcepts: questionAnalysis.keywords.filter(keyword =>
        chunk.content.toLowerCase().includes(keyword.toLowerCase())
      ),
      confidence: 0.6 - (index * 0.1)
    }));
  } catch (error) {
    console.error('Fallback search completely failed:', error);
    return generateEmergencyFallback(questionAnalysis);
  }
}

// Helper functions

function calculateVectorRelevanceScore(index: number, totalResults: number): number {
  // Higher relevance for earlier results
  return Math.max(0.1, 1 - (index / totalResults));
}

function extractMatchedConcepts(content: string, queryEmbedding: number[]): string[] {
  // Simple keyword extraction - in practice, you'd use more sophisticated methods
  const words = content.toLowerCase().split(/\s+/);
  return words.filter(word => word.length > 3).slice(0, 5);
}

function mapTypeToLegalDomain(type: string): string {
  const typeMap: Record<string, string> = {
    'statute': 'contract',
    'case': 'property',
    'principle': 'tort',
    'regulation': 'contract',
    'constitutional': 'constitutional',
    'criminal': 'criminal',
    'cyber': 'cyberSecurity'
  };
  
  return typeMap[type] || 'general';
}

function mapLegalDomainToTypes(domain: string): string[] {
  const domainMap: Record<string, string[]> = {
    'contract': ['statute', 'regulation', 'principle'],
    'property': ['case', 'statute'],
    'tort': ['case', 'principle'],
    'constitutional': ['constitutional', 'case'],
    'criminal': ['criminal', 'case', 'statute'],
    'cyberSecurity': ['cyber', 'statute', 'regulation']
  };
  
  return domainMap[domain] || [];
}

function combineHybridResults(
  ftsData: any[],
  vectorResults: SearchResult[],
  queryText: string
): SearchResult[] {
  const combinedMap = new Map<string, SearchResult>();
  
  // Add FTS results with text relevance scoring
  ftsData.forEach((chunk, index) => {
    const key = `${chunk.title}_${chunk.citation}`;
    combinedMap.set(key, {
      document: {
        title: chunk.title,
        description: chunk.content,
        citation: chunk.citation || '',
        type: chunk.type,
        domain: mapTypeToLegalDomain(chunk.type),
        jurisdiction: chunk.jurisdiction,
        section: chunk.section
      },
      relevanceScore: 0.8 - (index * 0.1), // FTS relevance
      matchedConcepts: extractKeywordMatches(chunk.content, queryText),
      confidence: 0.7
    });
  });
  
  // Merge vector results, boosting scores if they also appeared in FTS
  vectorResults.forEach(result => {
    const key = `${result.document.title}_${result.document.citation}`;
    const existing = combinedMap.get(key);
    
    if (existing) {
      // Boost score for items found in both searches
      existing.relevanceScore = Math.min(1.0, existing.relevanceScore + result.relevanceScore * 0.3);
      existing.confidence = Math.min(1.0, existing.confidence + 0.2);
    } else {
      combinedMap.set(key, result);
    }
  });
  
  return Array.from(combinedMap.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function extractKeywordMatches(content: string, queryText: string): string[] {
  const queryWords = queryText.toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();
  
  return queryWords.filter(word => 
    word.length > 2 && contentLower.includes(word)
  );
}

function generateEmergencyFallback(questionAnalysis: QuestionAnalysis): SearchResult[] {
  // Generate a basic fallback response when all searches fail
  return [{
    document: {
      title: "General Legal Guidance",
      description: `For questions about ${questionAnalysis.legalDomain} law, please consult relevant statutes, case law, and legal precedents. Consider seeking professional legal advice for specific situations.`,
      citation: "General Legal Reference",
      type: "guidance",
      domain: questionAnalysis.legalDomain || 'general'
    },
    relevanceScore: 0.1,
    matchedConcepts: questionAnalysis.keywords.slice(0, 3),
    confidence: 0.1
  }];
}
