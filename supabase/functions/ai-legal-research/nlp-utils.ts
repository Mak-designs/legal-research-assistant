
// Advanced NLP utilities for legal research

export interface LegalEntity {
  text: string;
  type: 'case' | 'statute' | 'jurisdiction' | 'legal_concept' | 'party' | 'date';
  confidence: number;
}

export interface QuestionAnalysis {
  intent: 'definition' | 'procedure' | 'requirements' | 'comparison' | 'application' | 'general';
  entities: LegalEntity[];
  keywords: string[];
  jurisdiction: string;
  legalDomain: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

/**
 * Enhanced Named Entity Recognition for legal text
 */
export function extractLegalEntities(text: string): LegalEntity[] {
  const entities: LegalEntity[] = [];
  const lowerText = text.toLowerCase();
  
  // Legal case patterns
  const casePatterns = [
    /([A-Z][a-z]+ v\.? [A-Z][a-z]+)/g,
    /([A-Z][a-z]+ vs\.? [A-Z][a-z]+)/g,
    /([A-Z][a-z]+ and [A-Z][a-z]+ v\.? [A-Z][a-z]+)/g
  ];
  
  casePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        entities.push({
          text: match,
          type: 'case',
          confidence: 0.9
        });
      });
    }
  });
  
  // Statute patterns
  const statutePatterns = [
    /(act no\.?\s*\d+\s*of\s*\d{4})/gi,
    /(section\s*\d+)/gi,
    /(chapter\s*\d+)/gi,
    /(\d+\s*u\.s\.c\.?\s*§?\s*\d+)/gi
  ];
  
  statutePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        entities.push({
          text: match,
          type: 'statute',
          confidence: 0.85
        });
      });
    }
  });
  
  // Jurisdiction detection
  const jurisdictions = ['zambia', 'zambian', 'lusaka', 'ndola', 'united states', 'uk', 'england'];
  jurisdictions.forEach(jurisdiction => {
    if (lowerText.includes(jurisdiction)) {
      entities.push({
        text: jurisdiction,
        type: 'jurisdiction',
        confidence: 0.8
      });
    }
  });
  
  // Legal concepts
  const legalConcepts = [
    'contract', 'tort', 'negligence', 'liability', 'damages', 'breach',
    'consideration', 'offer', 'acceptance', 'duty of care', 'causation',
    'property', 'ownership', 'possession', 'title', 'deed', 'easement',
    'constitutional rights', 'due process', 'equal protection', 'freedom',
    'criminal law', 'evidence', 'burden of proof', 'reasonable doubt'
  ];
  
  legalConcepts.forEach(concept => {
    if (lowerText.includes(concept)) {
      entities.push({
        text: concept,
        type: 'legal_concept',
        confidence: 0.7
      });
    }
  });
  
  return entities;
}

/**
 * Analyze user question intent and extract key information
 */
export function analyzeUserQuestion(question: string): QuestionAnalysis {
  const lowerQuestion = question.toLowerCase();
  
  // Intent classification
  let intent: QuestionAnalysis['intent'] = 'general';
  
  if (lowerQuestion.includes('what is') || lowerQuestion.includes('define') || lowerQuestion.includes('meaning')) {
    intent = 'definition';
  } else if (lowerQuestion.includes('how to') || lowerQuestion.includes('procedure') || lowerQuestion.includes('steps')) {
    intent = 'procedure';
  } else if (lowerQuestion.includes('requirements') || lowerQuestion.includes('elements') || lowerQuestion.includes('criteria')) {
    intent = 'requirements';
  } else if (lowerQuestion.includes('difference') || lowerQuestion.includes('compare') || lowerQuestion.includes('distinguish')) {
    intent = 'comparison';
  } else if (lowerQuestion.includes('apply') || lowerQuestion.includes('case study') || lowerQuestion.includes('example')) {
    intent = 'application';
  }
  
  // Extract entities
  const entities = extractLegalEntities(question);
  
  // Extract keywords (simplified approach)
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'is', 'are', 'was', 'were', 'what', 'how', 'when', 'where', 'why'];
  const words = question.toLowerCase().split(/\s+/);
  const keywords = words.filter(word => 
    word.length > 3 && 
    !stopWords.includes(word) && 
    !word.match(/^\d+$/)
  );
  
  // Determine jurisdiction
  let jurisdiction = 'general';
  const zambianKeywords = ['zambia', 'zambian', 'lusaka'];
  if (zambianKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    jurisdiction = 'zambian';
  }
  
  // Determine legal domain
  let legalDomain = 'general';
  if (lowerQuestion.includes('contract') || lowerQuestion.includes('agreement')) {
    legalDomain = 'contract';
  } else if (lowerQuestion.includes('property') || lowerQuestion.includes('land')) {
    legalDomain = 'property';
  } else if (lowerQuestion.includes('tort') || lowerQuestion.includes('negligence')) {
    legalDomain = 'tort';
  } else if (lowerQuestion.includes('constitutional') || lowerQuestion.includes('rights')) {
    legalDomain = 'constitutional';
  } else if (lowerQuestion.includes('criminal') || lowerQuestion.includes('crime')) {
    legalDomain = 'criminal';
  } else if (lowerQuestion.includes('cyber') || lowerQuestion.includes('digital')) {
    legalDomain = 'cyberSecurity';
  }
  
  // Determine complexity
  let complexity: QuestionAnalysis['complexity'] = 'simple';
  if (entities.length > 3 || keywords.length > 6) {
    complexity = 'complex';
  } else if (entities.length > 1 || keywords.length > 3) {
    complexity = 'moderate';
  }
  
  return {
    intent,
    entities,
    keywords,
    jurisdiction,
    legalDomain,
    complexity
  };
}

/**
 * Generate semantic keywords for better search
 */
export function generateSemanticKeywords(question: string, domain: string): string[] {
  const baseKeywords = question.toLowerCase().split(/\s+/)
    .filter(word => word.length > 3);
  
  const semanticExpansions: Record<string, string[]> = {
    contract: ['agreement', 'offer', 'acceptance', 'consideration', 'breach', 'performance', 'terms', 'conditions'],
    property: ['ownership', 'possession', 'title', 'deed', 'real estate', 'land', 'tenant', 'landlord'],
    tort: ['negligence', 'liability', 'damages', 'duty', 'breach', 'causation', 'harm', 'injury'],
    constitutional: ['rights', 'freedom', 'liberty', 'due process', 'equal protection', 'amendment'],
    criminal: ['crime', 'felony', 'misdemeanor', 'prosecution', 'defense', 'evidence', 'guilt', 'innocence'],
    cyberSecurity: ['digital', 'electronic', 'data', 'privacy', 'security', 'encryption', 'authentication'],
    zambian: ['Zambian law', 'customary law', 'common law', 'Lusaka', 'Supreme Court of Zambia']
  };
  
  const expandedKeywords = [...baseKeywords];
  
  if (semanticExpansions[domain]) {
    baseKeywords.forEach(keyword => {
      semanticExpansions[domain].forEach(expansion => {
        if (expansion.includes(keyword) || keyword.includes(expansion)) {
          expandedKeywords.push(expansion);
        }
      });
    });
  }
  
  return [...new Set(expandedKeywords)];
}

/**
 * Score relevance between query and document
 */
export function calculateRelevanceScore(
  questionAnalysis: QuestionAnalysis,
  documentText: string,
  documentMetadata: { title: string; domain: string; citation?: string }
): number {
  let score = 0;
  const docText = documentText.toLowerCase();
  const docTitle = documentMetadata.title.toLowerCase();
  
  // Keyword matching with weights
  questionAnalysis.keywords.forEach(keyword => {
    if (docTitle.includes(keyword)) {
      score += 3; // Higher weight for title matches
    } else if (docText.includes(keyword)) {
      score += 1;
    }
  });
  
  // Entity matching
  questionAnalysis.entities.forEach(entity => {
    if (docText.includes(entity.text.toLowerCase())) {
      score += entity.confidence * 2;
    }
  });
  
  // Domain matching
  if (documentMetadata.domain === questionAnalysis.legalDomain) {
    score += 2;
  }
  
  // Jurisdiction matching
  if (questionAnalysis.jurisdiction === 'zambian' && docText.includes('zambia')) {
    score += 1.5;
  }
  
  return score;
}
