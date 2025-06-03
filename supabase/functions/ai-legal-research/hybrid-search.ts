
// Hybrid search combining semantic and keyword-based retrieval

import { QuestionAnalysis } from './nlp-utils.ts';
import { SearchResult } from './semantic-search.ts';

export interface HybridSearchOptions {
  semanticWeight: number;
  keywordWeight: number;
  maxResults: number;
  minRelevanceScore: number;
}

export function performHybridSearch(
  questionAnalysis: QuestionAnalysis,
  legalDataset: any,
  options: HybridSearchOptions = {
    semanticWeight: 0.7,
    keywordWeight: 0.3,
    maxResults: 8,
    minRelevanceScore: 0.2
  }
): SearchResult[] {
  
  // Perform semantic search
  const semanticResults = performSemanticSearch(questionAnalysis, legalDataset, {
    maxResults: options.maxResults * 2,
    minRelevanceScore: 0.1
  });
  
  // Perform keyword-based search
  const keywordResults = performKeywordSearch(questionAnalysis, legalDataset, {
    maxResults: options.maxResults * 2,
    minRelevanceScore: 0.1
  });
  
  // Combine and rerank results
  const combinedResults = combineSearchResults(
    semanticResults, 
    keywordResults, 
    options
  );
  
  return combinedResults
    .filter(result => result.relevanceScore >= options.minRelevanceScore)
    .slice(0, options.maxResults);
}

function performSemanticSearch(
  questionAnalysis: QuestionAnalysis,
  legalDataset: any,
  options: any
): SearchResult[] {
  // This would normally use the existing semantic search
  // For now, using simplified semantic matching
  const results: SearchResult[] = [];
  const query = questionAnalysis.keywords.join(' ').toLowerCase();
  
  Object.keys(legalDataset).forEach(domain => {
    const domainData = legalDataset[domain];
    
    // Search cases
    domainData.cases?.forEach((caseDoc: any) => {
      const text = `${caseDoc.title} ${caseDoc.description}`.toLowerCase();
      const semanticScore = calculateSemanticRelevance(query, text, questionAnalysis);
      
      if (semanticScore > 0.1) {
        results.push({
          document: { ...caseDoc, type: 'case', domain },
          relevanceScore: semanticScore,
          matchedConcepts: extractMatchedConcepts(query, text),
          confidence: Math.min(semanticScore, 1)
        });
      }
    });
    
    // Search statutes
    domainData.statutes?.forEach((statute: any) => {
      const text = `${statute.title} ${statute.description}`.toLowerCase();
      const semanticScore = calculateSemanticRelevance(query, text, questionAnalysis);
      
      if (semanticScore > 0.1) {
        results.push({
          document: { ...statute, type: 'statute', domain },
          relevanceScore: semanticScore,
          matchedConcepts: extractMatchedConcepts(query, text),
          confidence: Math.min(semanticScore, 1)
        });
      }
    });
  });
  
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function performKeywordSearch(
  questionAnalysis: QuestionAnalysis,
  legalDataset: any,
  options: any
): SearchResult[] {
  const results: SearchResult[] = [];
  const keywords = questionAnalysis.keywords.map(k => k.toLowerCase());
  
  Object.keys(legalDataset).forEach(domain => {
    const domainData = legalDataset[domain];
    
    // Search cases
    domainData.cases?.forEach((caseDoc: any) => {
      const text = `${caseDoc.title} ${caseDoc.description}`.toLowerCase();
      const keywordScore = calculateKeywordRelevance(keywords, text);
      
      if (keywordScore > 0.1) {
        results.push({
          document: { ...caseDoc, type: 'case', domain },
          relevanceScore: keywordScore,
          matchedConcepts: keywords.filter(k => text.includes(k)),
          confidence: Math.min(keywordScore, 1)
        });
      }
    });
    
    // Search statutes
    domainData.statutes?.forEach((statute: any) => {
      const text = `${statute.title} ${statute.description}`.toLowerCase();
      const keywordScore = calculateKeywordRelevance(keywords, text);
      
      if (keywordScore > 0.1) {
        results.push({
          document: { ...statute, type: 'statute', domain },
          relevanceScore: keywordScore,
          matchedConcepts: keywords.filter(k => text.includes(k)),
          confidence: Math.min(keywordScore, 1)
        });
      }
    });
  });
  
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function calculateSemanticRelevance(
  query: string, 
  documentText: string, 
  questionAnalysis: QuestionAnalysis
): number {
  let score = 0;
  
  // Boost for exact phrase matches
  if (documentText.includes(query)) {
    score += 2;
  }
  
  // Boost for legal domain relevance
  if (questionAnalysis.legalDomain !== 'general') {
    const domainTerms = getDomainSpecificTerms(questionAnalysis.legalDomain);
    domainTerms.forEach(term => {
      if (documentText.includes(term.toLowerCase())) {
        score += 1.5;
      }
    });
  }
  
  // Boost for intent-specific terms
  const intentTerms = getIntentSpecificTerms(questionAnalysis.intent);
  intentTerms.forEach(term => {
    if (documentText.includes(term.toLowerCase())) {
      score += 1;
    }
  });
  
  return Math.min(score / 10, 1); // Normalize to 0-1
}

function calculateKeywordRelevance(keywords: string[], documentText: string): number {
  let matches = 0;
  let totalWeight = 0;
  
  keywords.forEach(keyword => {
    const weight = keyword.length > 3 ? 2 : 1; // Longer keywords get more weight
    totalWeight += weight;
    
    if (documentText.includes(keyword)) {
      matches += weight;
    }
  });
  
  return totalWeight > 0 ? matches / totalWeight : 0;
}

function combineSearchResults(
  semanticResults: SearchResult[],
  keywordResults: SearchResult[],
  options: HybridSearchOptions
): SearchResult[] {
  const combinedMap = new Map<string, SearchResult>();
  
  // Add semantic results
  semanticResults.forEach(result => {
    const key = `${result.document.title}_${result.document.citation}`;
    combinedMap.set(key, {
      ...result,
      relevanceScore: result.relevanceScore * options.semanticWeight
    });
  });
  
  // Add or merge keyword results
  keywordResults.forEach(result => {
    const key = `${result.document.title}_${result.document.citation}`;
    const existing = combinedMap.get(key);
    
    if (existing) {
      // Merge scores
      existing.relevanceScore += result.relevanceScore * options.keywordWeight;
      existing.matchedConcepts = [
        ...new Set([...existing.matchedConcepts, ...result.matchedConcepts])
      ];
    } else {
      combinedMap.set(key, {
        ...result,
        relevanceScore: result.relevanceScore * options.keywordWeight
      });
    }
  });
  
  return Array.from(combinedMap.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function getDomainSpecificTerms(domain: string): string[] {
  const domainTerms: Record<string, string[]> = {
    'contract': ['agreement', 'consideration', 'breach', 'performance', 'offer', 'acceptance'],
    'property': ['ownership', 'title', 'possession', 'easement', 'deed', 'conveyance'],
    'tort': ['negligence', 'liability', 'damages', 'duty', 'causation', 'injury'],
    'criminal': ['prosecution', 'evidence', 'burden', 'proof', 'defendant', 'guilty'],
    'constitutional': ['rights', 'amendment', 'due process', 'equal protection', 'freedom'],
    'cyber': ['data', 'electronic', 'digital', 'computer', 'network', 'cybersecurity']
  };
  
  return domainTerms[domain] || [];
}

function getIntentSpecificTerms(intent: string): string[] {
  const intentTerms: Record<string, string[]> = {
    'definition': ['means', 'defined', 'definition', 'refers to', 'shall mean'],
    'requirements': ['must', 'shall', 'required', 'necessary', 'conditions'],
    'procedure': ['steps', 'process', 'procedure', 'filing', 'application'],
    'penalties': ['fine', 'penalty', 'punishment', 'sanctions', 'violation'],
    'comparison': ['differs', 'similar', 'unlike', 'contrast', 'comparison']
  };
  
  return intentTerms[intent] || [];
}

function extractMatchedConcepts(query: string, text: string): string[] {
  const queryTerms = query.split(/\s+/);
  return queryTerms.filter(term => text.includes(term));
}
