
// Dynamic document retrieval for comparison analysis

import { ComparisonCriteria } from './comparison-analyzer.ts';
import { QuestionAnalysis } from './nlp-utils.ts';
import { performSemanticSearch, SearchResult } from './semantic-search.ts';

export interface ComparisonDocument {
  jurisdiction: string;
  topic: string;
  documents: SearchResult[];
}

/**
 * Retrieve documents for comparison analysis with improved relevance
 */
export function retrieveComparisonDocuments(
  criteria: ComparisonCriteria,
  questionAnalysis: QuestionAnalysis,
  legalDataset: any
): ComparisonDocument[] {
  const comparisonDocs: ComparisonDocument[] = [];
  
  // Focus on the most relevant topics for the query
  const relevantTopics = getRelevantTopics(criteria, questionAnalysis);
  const relevantJurisdictions = getRelevantJurisdictions(criteria);
  
  // For each relevant combination, retrieve documents
  relevantJurisdictions.forEach(jurisdiction => {
    relevantTopics.forEach(topic => {
      // Build focused search query
      const enhancedQuery = buildFocusedQuery(criteria, jurisdiction, topic);
      
      // Perform targeted semantic search
      const searchResults = performSemanticSearch(
        { 
          ...questionAnalysis, 
          keywords: [...questionAnalysis.keywords, ...getTopicKeywords(topic)],
          jurisdiction,
          legalDomain: topic
        },
        legalDataset,
        {
          maxResults: 8,
          minRelevanceScore: 0.4,
          prioritizeDomain: topic,
          filterByDomain: true
        }
      );
      
      // Filter and validate results for relevance
      const relevantResults = filterRelevantResults(searchResults, criteria, topic);
      
      if (relevantResults.length > 0) {
        comparisonDocs.push({
          jurisdiction,
          topic,
          documents: relevantResults
        });
      }
    });
  });
  
  // If no specific results, get general but focused results
  if (comparisonDocs.length === 0) {
    const fallbackResults = getFallbackResults(criteria, questionAnalysis, legalDataset);
    if (fallbackResults.length > 0) {
      comparisonDocs.push({
        jurisdiction: 'general',
        topic: criteria.topics[0] || 'general_law',
        documents: fallbackResults
      });
    }
  }
  
  return comparisonDocs;
}

function getRelevantTopics(criteria: ComparisonCriteria, questionAnalysis: QuestionAnalysis): string[] {
  // Prioritize topics based on query specificity
  const queryLower = criteria.primaryQuery.toLowerCase();
  
  // If query is asking about specific doctrine, focus on that
  if (queryLower.includes('estoppel')) {
    return ['estoppel_law'];
  }
  
  if (queryLower.includes('adverse possession')) {
    return ['property_law'];
  }
  
  if (queryLower.includes('force majeure')) {
    return ['contract_law'];
  }
  
  if (queryLower.includes('elements') && queryLower.includes('contract')) {
    return ['contract_law'];
  }
  
  // Use detected topics but limit to most relevant
  return criteria.topics.slice(0, 2);
}

function getRelevantJurisdictions(criteria: ComparisonCriteria): string[] {
  // If specific jurisdictions mentioned, use those
  if (criteria.jurisdictions.length > 0 && !criteria.jurisdictions.includes('general')) {
    return criteria.jurisdictions;
  }
  
  // Default to general for most queries
  return ['general'];
}

function getTopicKeywords(topic: string): string[] {
  const topicKeywords: Record<string, string[]> = {
    'contract_law': ['contract', 'agreement', 'offer', 'acceptance', 'consideration'],
    'property_law': ['property', 'ownership', 'possession', 'title', 'adverse possession'],
    'tort_law': ['tort', 'negligence', 'liability', 'damages'],
    'criminal_law': ['criminal', 'crime', 'prosecution', 'evidence'],
    'constitutional_law': ['constitutional', 'rights', 'freedom'],
    'cyber_law': ['cyber', 'digital', 'electronic', 'data'],
    'evidence_law': ['evidence', 'proof', 'admissibility'],
    'privacy_law': ['privacy', 'data protection'],
    'estoppel_law': ['estoppel', 'promissory', 'proprietary', 'representation'],
    'force_majeure': ['force majeure', 'impossibility', 'frustration']
  };
  
  return topicKeywords[topic] || ['legal', 'law'];
}

function buildFocusedQuery(criteria: ComparisonCriteria, jurisdiction: string, topic: string): string {
  const baseQuery = criteria.primaryQuery;
  const topicTerms = getTopicKeywords(topic);
  const jurisdictionTerms = getJurisdictionTerms(jurisdiction);
  
  // Combine base query with focused terms
  return `${baseQuery} ${topicTerms.join(' ')} ${jurisdictionTerms.join(' ')}`.trim();
}

function getJurisdictionTerms(jurisdiction: string): string[] {
  const jurisdictionMap: Record<string, string[]> = {
    'zambian': ['Zambia', 'Zambian law'],
    'usa': ['United States', 'American law'],
    'uk': ['United Kingdom', 'English law'],
    'canada': ['Canadian law'],
    'australia': ['Australian law'],
    'south_africa': ['South African law'],
    'nigeria': ['Nigerian law'],
    'kenya': ['Kenyan law'],
    'general': ['common law', 'legal principles']
  };
  
  return jurisdictionMap[jurisdiction] || jurisdictionMap['general'];
}

function filterRelevantResults(results: SearchResult[], criteria: ComparisonCriteria, topic: string): SearchResult[] {
  const queryLower = criteria.primaryQuery.toLowerCase();
  
  // Apply topic-specific filtering
  return results.filter(result => {
    const resultText = `${result.document.title} ${result.document.description}`.toLowerCase();
    
    // For specific doctrines, ensure relevance
    if (queryLower.includes('estoppel')) {
      return resultText.includes('estoppel') || 
             resultText.includes('promissory') || 
             resultText.includes('representation');
    }
    
    if (queryLower.includes('adverse possession')) {
      return resultText.includes('adverse possession') || 
             resultText.includes('possession') || 
             resultText.includes('title');
    }
    
    if (queryLower.includes('force majeure')) {
      return resultText.includes('force majeure') || 
             resultText.includes('impossibility') || 
             resultText.includes('frustration');
    }
    
    // General relevance check
    return result.relevanceScore > 0.3;
  });
}

function getFallbackResults(criteria: ComparisonCriteria, questionAnalysis: QuestionAnalysis, legalDataset: any): SearchResult[] {
  // Get general results but still try to be relevant
  const fallbackResults = performSemanticSearch(
    questionAnalysis,
    legalDataset,
    {
      maxResults: 6,
      minRelevanceScore: 0.2
    }
  );
  
  return fallbackResults;
}

/**
 * Merge and rank documents from multiple sources for comprehensive comparison
 */
export function mergeComparisonResults(comparisonDocs: ComparisonDocument[]): SearchResult[] {
  const allDocuments: SearchResult[] = [];
  
  // Collect all documents with jurisdiction and topic metadata
  comparisonDocs.forEach(comparisonDoc => {
    comparisonDoc.documents.forEach(doc => {
      allDocuments.push({
        ...doc,
        document: {
          ...doc.document,
          comparisonJurisdiction: comparisonDoc.jurisdiction,
          comparisonTopic: comparisonDoc.topic
        }
      });
    });
  });
  
  // Remove duplicates and sort by relevance
  const uniqueDocs = removeDuplicateDocuments(allDocuments);
  
  // Sort by relevance score (highest first)
  return uniqueDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function removeDuplicateDocuments(documents: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return documents.filter(doc => {
    const key = `${doc.document.title}_${doc.document.citation}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
