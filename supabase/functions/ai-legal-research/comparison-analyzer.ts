
// Enhanced comparison analysis for dynamic legal research

export interface ComparisonCriteria {
  jurisdictions: string[];
  topics: string[];
  comparisonType: 'definition' | 'penalties' | 'procedures' | 'scope' | 'enforcement' | 'general';
  specificAspects: string[];
  legalDomains: string[];
}

export interface ComparisonRequest {
  query: string;
  criteria: ComparisonCriteria;
  intent: string;
}

/**
 * Extract comparison criteria from user query
 */
export function extractComparisonCriteria(query: string): ComparisonCriteria {
  const lowerQuery = query.toLowerCase();
  
  // Extract jurisdictions
  const jurisdictions = extractJurisdictions(query);
  
  // Extract topics and legal concepts
  const topics = extractTopics(query);
  
  // Determine comparison type
  const comparisonType = determineComparisonType(query);
  
  // Extract specific aspects to compare
  const specificAspects = extractSpecificAspects(query);
  
  // Extract legal domains
  const legalDomains = extractLegalDomains(query);
  
  return {
    jurisdictions,
    topics,
    comparisonType,
    specificAspects,
    legalDomains
  };
}

function extractJurisdictions(query: string): string[] {
  const jurisdictions: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Common jurisdiction patterns
  const jurisdictionPatterns = [
    { pattern: /\bzambia\w*/gi, jurisdiction: 'zambian' },
    { pattern: /\bzambian\w*/gi, jurisdiction: 'zambian' },
    { pattern: /\busas?\w*/gi, jurisdiction: 'usa' },
    { pattern: /\bunited states\w*/gi, jurisdiction: 'usa' },
    { pattern: /\bukw*/gi, jurisdiction: 'uk' },
    { pattern: /\bbritish\w*/gi, jurisdiction: 'uk' },
    { pattern: /\bengland\w*/gi, jurisdiction: 'uk' },
    { pattern: /\bcanada\w*/gi, jurisdiction: 'canada' },
    { pattern: /\baustralia\w*/gi, jurisdiction: 'australia' },
    { pattern: /\bsouth africa\w*/gi, jurisdiction: 'south_africa' },
    { pattern: /\bnigeria\w*/gi, jurisdiction: 'nigeria' },
    { pattern: /\bkenya\w*/gi, jurisdiction: 'kenya' }
  ];
  
  jurisdictionPatterns.forEach(({ pattern, jurisdiction }) => {
    if (pattern.test(query) && !jurisdictions.includes(jurisdiction)) {
      jurisdictions.push(jurisdiction);
    }
  });
  
  // If no specific jurisdictions found, check for comparative keywords
  if (jurisdictions.length === 0 && /\bcompare\b|\bvs?\b|\bversus\b|\bdifference\b/i.test(query)) {
    jurisdictions.push('general');
  }
  
  return jurisdictions.length > 0 ? jurisdictions : ['general'];
}

function extractTopics(query: string): string[] {
  const topics: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  const topicPatterns = [
    { pattern: /\bcontract\w*|\bagreement\w*/gi, topic: 'contract_law' },
    { pattern: /\bproperty\w*|\bland\w*|\bestate\w*/gi, topic: 'property_law' },
    { pattern: /\btort\w*|\bnegligence\w*/gi, topic: 'tort_law' },
    { pattern: /\bcriminal\w*|\bcrime\w*/gi, topic: 'criminal_law' },
    { pattern: /\bconstitutional\w*|\brights\w*/gi, topic: 'constitutional_law' },
    { pattern: /\bcyber\w*|\bdigital\w*|\belectronic\w*/gi, topic: 'cyber_law' },
    { pattern: /\bevidence\w*|\bproof\w*/gi, topic: 'evidence_law' },
    { pattern: /\bprivacy\w*|\bdata protection\w*/gi, topic: 'privacy_law' },
    { pattern: /\bsignature\w*|\bauthentication\w*/gi, topic: 'digital_signatures' },
    { pattern: /\btermination\w*|\bending\w*|\bcancel\w*/gi, topic: 'contract_termination' }
  ];
  
  topicPatterns.forEach(({ pattern, topic }) => {
    if (pattern.test(query) && !topics.includes(topic)) {
      topics.push(topic);
    }
  });
  
  return topics.length > 0 ? topics : ['general_law'];
}

function determineComparisonType(query: string): ComparisonCriteria['comparisonType'] {
  const lowerQuery = query.toLowerCase();
  
  if (/\bdefin\w*|\bmeaning\w*|\bwhat is\w*/i.test(query)) {
    return 'definition';
  } else if (/\bpenalt\w*|\bsanction\w*|\bpunishment\w*/i.test(query)) {
    return 'penalties';
  } else if (/\bprocedure\w*|\bprocess\w*|\bsteps\w*/i.test(query)) {
    return 'procedures';
  } else if (/\bscope\w*|\bapplication\w*|\bcoverage\w*/i.test(query)) {
    return 'scope';
  } else if (/\benforcement\w*|\bimplementation\w*/i.test(query)) {
    return 'enforcement';
  }
  
  return 'general';
}

function extractSpecificAspects(query: string): string[] {
  const aspects: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  const aspectPatterns = [
    'termination clauses', 'force majeure', 'consideration', 'breach remedies',
    'chain of custody', 'hash verification', 'authentication methods',
    'burden of proof', 'admissibility', 'expert testimony',
    'constitutional rights', 'due process', 'equal protection',
    'liability', 'damages', 'causation', 'duty of care'
  ];
  
  aspectPatterns.forEach(aspect => {
    if (lowerQuery.includes(aspect.toLowerCase())) {
      aspects.push(aspect);
    }
  });
  
  return aspects;
}

function extractLegalDomains(query: string): string[] {
  const domains: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  const domainMap = {
    'contract': ['contract', 'agreement', 'offer', 'acceptance'],
    'property': ['property', 'land', 'ownership', 'possession'],
    'tort': ['tort', 'negligence', 'liability'],
    'constitutional': ['constitutional', 'rights', 'freedom'],
    'criminal': ['criminal', 'crime', 'prosecution'],
    'cyberSecurity': ['cyber', 'digital', 'electronic', 'data']
  };
  
  Object.entries(domainMap).forEach(([domain, keywords]) => {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      domains.push(domain);
    }
  });
  
  return domains.length > 0 ? domains : ['general'];
}

/**
 * Generate dynamic comparison prompt based on extracted criteria
 */
export function generateComparisonPrompt(
  criteria: ComparisonCriteria,
  query: string,
  retrievedDocuments: any[]
): string {
  let prompt = `You are a legal research expert. Based on the following query and legal documents, provide a comprehensive comparison analysis.\n\n`;
  
  prompt += `User Query: "${query}"\n\n`;
  
  // Add jurisdiction context
  if (criteria.jurisdictions.length > 1) {
    prompt += `Jurisdictions to Compare: ${criteria.jurisdictions.join(' vs ')}\n`;
  } else {
    prompt += `Jurisdiction Context: ${criteria.jurisdictions[0]}\n`;
  }
  
  // Add topic focus
  if (criteria.topics.length > 0) {
    prompt += `Legal Topics: ${criteria.topics.join(', ')}\n`;
  }
  
  // Add comparison criteria
  prompt += `Comparison Focus: ${criteria.comparisonType}\n`;
  
  if (criteria.specificAspects.length > 0) {
    prompt += `Specific Aspects to Address: ${criteria.specificAspects.join(', ')}\n`;
  }
  
  prompt += `\n--- RELEVANT LEGAL DOCUMENTS ---\n`;
  
  // Add retrieved documents
  retrievedDocuments.forEach((doc, index) => {
    prompt += `\nDocument ${index + 1}: ${doc.title}\n`;
    prompt += `Source: ${doc.citation || 'N/A'}\n`;
    prompt += `Content: ${doc.description}\n`;
    if (doc.domain) prompt += `Domain: ${doc.domain}\n`;
  });
  
  prompt += `\n--- ANALYSIS REQUIREMENTS ---\n`;
  prompt += `Please provide a structured comparison that includes:\n`;
  prompt += `1. Key similarities between the jurisdictions/concepts\n`;
  prompt += `2. Important differences and their implications\n`;
  prompt += `3. Practical applications and examples\n`;
  prompt += `4. Citations to relevant legal authorities\n`;
  
  if (criteria.comparisonType === 'definition') {
    prompt += `5. Clear definitions from each jurisdiction with supporting authority\n`;
  } else if (criteria.comparisonType === 'penalties') {
    prompt += `5. Specific penalty structures and enforcement mechanisms\n`;
  } else if (criteria.comparisonType === 'procedures') {
    prompt += `5. Step-by-step procedural requirements and timelines\n`;
  }
  
  prompt += `\nProvide your response in JSON format with "recommendation", "primaryAnalysis", "secondaryAnalysis", and "technicalDetails" fields.`;
  
  return prompt;
}
