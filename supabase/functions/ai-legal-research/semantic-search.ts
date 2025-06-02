
// Enhanced semantic search for legal documents

import { QuestionAnalysis, calculateRelevanceScore, generateSemanticKeywords } from './nlp-utils.ts';

export interface SearchResult {
  document: any;
  relevanceScore: number;
  matchedConcepts: string[];
  confidence: number;
}

export interface SemanticSearchOptions {
  maxResults?: number;
  minRelevanceScore?: number;
  includeMetadata?: boolean;
  prioritizeDomain?: string;
}

/**
 * Perform semantic search across legal documents
 */
export function performSemanticSearch(
  questionAnalysis: QuestionAnalysis,
  legalDataset: any,
  options: SemanticSearchOptions = {}
): SearchResult[] {
  const {
    maxResults = 5,
    minRelevanceScore = 0.1,
    includeMetadata = true,
    prioritizeDomain
  } = options;
  
  const allResults: SearchResult[] = [];
  const semanticKeywords = generateSemanticKeywords(
    questionAnalysis.keywords.join(' '),
    questionAnalysis.legalDomain
  );
  
  // Search across all domains
  Object.keys(legalDataset).forEach(domain => {
    const domainData = legalDataset[domain];
    
    // Search cases
    domainData.cases?.forEach((caseDoc: any) => {
      const relevanceScore = calculateRelevanceScore(
        questionAnalysis,
        `${caseDoc.title} ${caseDoc.description}`,
        { title: caseDoc.title, domain, citation: caseDoc.citation }
      );
      
      if (relevanceScore >= minRelevanceScore) {
        const matchedConcepts = findMatchedConcepts(
          semanticKeywords,
          `${caseDoc.title} ${caseDoc.description}`
        );
        
        allResults.push({
          document: { ...caseDoc, type: 'case', domain },
          relevanceScore: prioritizeDomain === domain ? relevanceScore * 1.2 : relevanceScore,
          matchedConcepts,
          confidence: Math.min(relevanceScore / 10, 1)
        });
      }
    });
    
    // Search statutes
    domainData.statutes?.forEach((statute: any) => {
      const relevanceScore = calculateRelevanceScore(
        questionAnalysis,
        `${statute.title} ${statute.description}`,
        { title: statute.title, domain, citation: statute.citation }
      );
      
      if (relevanceScore >= minRelevanceScore) {
        const matchedConcepts = findMatchedConcepts(
          semanticKeywords,
          `${statute.title} ${statute.description}`
        );
        
        allResults.push({
          document: { ...statute, type: 'statute', domain },
          relevanceScore: prioritizeDomain === domain ? relevanceScore * 1.2 : relevanceScore,
          matchedConcepts,
          confidence: Math.min(relevanceScore / 10, 1)
        });
      }
    });
  });
  
  // Sort by relevance score and return top results
  return allResults
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Find concepts that match between keywords and document text
 */
function findMatchedConcepts(keywords: string[], documentText: string): string[] {
  const docText = documentText.toLowerCase();
  return keywords.filter(keyword => docText.includes(keyword.toLowerCase()));
}

/**
 * Extract relevant passages from documents
 */
export function extractRelevantPassages(
  searchResults: SearchResult[],
  questionAnalysis: QuestionAnalysis,
  maxPassageLength: number = 200
): Array<{document: any, passage: string, relevance: number}> {
  const passages = [];
  
  searchResults.forEach(result => {
    const text = `${result.document.title} ${result.document.description}`;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    sentences.forEach(sentence => {
      let passageRelevance = 0;
      
      // Check if sentence contains relevant keywords
      questionAnalysis.keywords.forEach(keyword => {
        if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
          passageRelevance += 1;
        }
      });
      
      // Check if sentence contains legal entities
      questionAnalysis.entities.forEach(entity => {
        if (sentence.toLowerCase().includes(entity.text.toLowerCase())) {
          passageRelevance += entity.confidence;
        }
      });
      
      if (passageRelevance > 0) {
        passages.push({
          document: result.document,
          passage: sentence.trim(),
          relevance: passageRelevance
        });
      }
    });
  });
  
  return passages
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
}

/**
 * Generate contextual answer based on search results
 */
export function generateContextualAnswer(
  questionAnalysis: QuestionAnalysis,
  searchResults: SearchResult[],
  passages: Array<{document: any, passage: string, relevance: number}>
): string {
  if (searchResults.length === 0) {
    return "I couldn't find specific legal authorities that directly address your question. Please try rephrasing your query or providing more specific details.";
  }
  
  let answer = "";
  
  // Start with intent-specific introduction
  switch (questionAnalysis.intent) {
    case 'definition':
      answer = "Based on the legal authorities, ";
      break;
    case 'requirements':
      answer = "The legal requirements include: ";
      break;
    case 'procedure':
      answer = "The procedural steps are: ";
      break;
    case 'comparison':
      answer = "Comparing the legal principles: ";
      break;
    case 'application':
      answer = "In practical application: ";
      break;
    default:
      answer = "According to the relevant legal authorities, ";
  }
  
  // Add the most relevant information
  const topResults = searchResults.slice(0, 3);
  const topPassages = passages.slice(0, 2);
  
  if (topPassages.length > 0) {
    answer += topPassages[0].passage;
    
    if (topPassages.length > 1) {
      answer += ` Additionally, ${topPassages[1].passage}`;
    }
  } else if (topResults.length > 0) {
    answer += topResults[0].document.description;
  }
  
  // Add citations
  const citations = topResults.map(result => 
    `${result.document.title} (${result.document.citation})`
  ).slice(0, 2);
  
  if (citations.length > 0) {
    answer += `\n\nRelevant authorities: ${citations.join('; ')}.`;
  }
  
  return answer;
}
