
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
 * Retrieve documents for comparison analysis
 */
export function retrieveComparisonDocuments(
  criteria: ComparisonCriteria,
  questionAnalysis: QuestionAnalysis,
  legalDataset: any
): ComparisonDocument[] {
  const comparisonDocs: ComparisonDocument[] = [];
  
  // For each jurisdiction, retrieve relevant documents
  criteria.jurisdictions.forEach(jurisdiction => {
    criteria.topics.forEach(topic => {
      // Enhance search for this specific jurisdiction and topic
      const enhancedQuery = buildEnhancedQuery(criteria, jurisdiction, topic);
      
      // Perform semantic search with jurisdiction and topic focus
      const searchResults = performSemanticSearch(
        { 
          ...questionAnalysis, 
          keywords: [...questionAnalysis.keywords, jurisdiction, topic],
          jurisdiction,
          legalDomain: topic
        },
        legalDataset,
        {
          maxResults: 6,
          minRelevanceScore: 0.3,
          prioritizeDomain: topic
        }
      );
      
      // Filter results by jurisdiction if not general
      const jurisdictionFiltered = jurisdiction === 'general' 
        ? searchResults 
        : searchResults.filter(result => 
            result.document.domain === jurisdiction || 
            result.document.description?.toLowerCase().includes(jurisdiction.toLowerCase())
          );
      
      if (jurisdictionFiltered.length > 0) {
        comparisonDocs.push({
          jurisdiction,
          topic,
          documents: jurisdictionFiltered
        });
      }
    });
  });
  
  // If no jurisdiction-specific results, get general results
  if (comparisonDocs.length === 0) {
    const generalResults = performSemanticSearch(
      questionAnalysis,
      legalDataset,
      {
        maxResults: 8,
        minRelevanceScore: 0.2
      }
    );
    
    comparisonDocs.push({
      jurisdiction: 'general',
      topic: 'general_law',
      documents: generalResults
    });
  }
  
  return comparisonDocs;
}

/**
 * Build enhanced query for specific jurisdiction and topic
 */
function buildEnhancedQuery(
  criteria: ComparisonCriteria,
  jurisdiction: string,
  topic: string
): string {
  let enhancedQuery = '';
  
  // Add jurisdiction-specific terms
  const jurisdictionTerms = getJurisdictionTerms(jurisdiction);
  enhancedQuery += jurisdictionTerms.join(' ') + ' ';
  
  // Add topic-specific terms
  const topicTerms = getTopicTerms(topic);
  enhancedQuery += topicTerms.join(' ') + ' ';
  
  // Add comparison-specific terms
  if (criteria.comparisonType !== 'general') {
    const comparisonTerms = getComparisonTerms(criteria.comparisonType);
    enhancedQuery += comparisonTerms.join(' ') + ' ';
  }
  
  // Add specific aspects
  if (criteria.specificAspects.length > 0) {
    enhancedQuery += criteria.specificAspects.join(' ') + ' ';
  }
  
  return enhancedQuery.trim();
}

function getJurisdictionTerms(jurisdiction: string): string[] {
  const jurisdictionMap: Record<string, string[]> = {
    'zambian': ['Zambia', 'Zambian law', 'Lusaka', 'Supreme Court of Zambia'],
    'usa': ['United States', 'American law', 'federal', 'Supreme Court'],
    'uk': ['United Kingdom', 'English law', 'British', 'House of Lords'],
    'canada': ['Canadian law', 'Supreme Court of Canada'],
    'australia': ['Australian law', 'High Court of Australia'],
    'south_africa': ['South African law', 'Constitutional Court'],
    'nigeria': ['Nigerian law', 'Supreme Court of Nigeria'],
    'kenya': ['Kenyan law', 'Court of Appeal of Kenya'],
    'general': ['common law', 'legal principles', 'international law']
  };
  
  return jurisdictionMap[jurisdiction] || jurisdictionMap['general'];
}

function getTopicTerms(topic: string): string[] {
  const topicMap: Record<string, string[]> = {
    'contract_law': ['contract', 'agreement', 'offer', 'acceptance', 'consideration'],
    'property_law': ['property', 'ownership', 'possession', 'title', 'land'],
    'tort_law': ['tort', 'negligence', 'liability', 'damages', 'duty of care'],
    'criminal_law': ['criminal', 'crime', 'prosecution', 'defense', 'evidence'],
    'constitutional_law': ['constitutional', 'rights', 'freedom', 'due process'],
    'cyber_law': ['cyber', 'digital', 'electronic', 'data', 'technology'],
    'evidence_law': ['evidence', 'proof', 'admissibility', 'testimony'],
    'privacy_law': ['privacy', 'data protection', 'confidentiality'],
    'digital_signatures': ['signature', 'authentication', 'verification'],
    'contract_termination': ['termination', 'breach', 'cancellation'],
    'general_law': ['legal', 'law', 'court', 'statute', 'case']
  };
  
  return topicMap[topic] || topicMap['general_law'];
}

function getComparisonTerms(comparisonType: string): string[] {
  const comparisonMap: Record<string, string[]> = {
    'definition': ['definition', 'meaning', 'elements', 'criteria'],
    'penalties': ['penalty', 'sanction', 'punishment', 'fine', 'imprisonment'],
    'procedures': ['procedure', 'process', 'steps', 'requirements', 'method'],
    'scope': ['scope', 'application', 'coverage', 'extent', 'jurisdiction'],
    'enforcement': ['enforcement', 'implementation', 'compliance', 'monitoring'],
    'general': ['law', 'legal', 'principle', 'rule', 'regulation']
  };
  
  return comparisonMap[comparisonType] || comparisonMap['general'];
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
