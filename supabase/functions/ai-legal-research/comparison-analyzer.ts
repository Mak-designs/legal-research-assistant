
// Enhanced comparison analysis for dynamic legal research

export interface ComparisonCriteria {
  jurisdictions: string[];
  topics: string[];
  comparisonType: 'definition' | 'penalties' | 'procedures' | 'scope' | 'enforcement' | 'general';
  specificAspects: string[];
  legalDomains: string[];
  primaryQuery: string;
}

export interface ComparisonRequest {
  query: string;
  criteria: ComparisonCriteria;
  intent: string;
}

/**
 * Extract comparison criteria from user query with improved accuracy
 */
export function extractComparisonCriteria(query: string): ComparisonCriteria {
  const lowerQuery = query.toLowerCase();
  
  // Extract jurisdictions
  const jurisdictions = extractJurisdictions(query);
  
  // Extract topics and legal concepts with better context matching
  const topics = extractTopicsFromQuery(query);
  
  // Determine comparison type based on query intent
  const comparisonType = determineComparisonType(query);
  
  // Extract specific aspects to compare
  const specificAspects = extractSpecificAspects(query);
  
  // Extract legal domains with better accuracy
  const legalDomains = extractLegalDomainsFromQuery(query);
  
  return {
    jurisdictions,
    topics,
    comparisonType,
    specificAspects,
    legalDomains,
    primaryQuery: query
  };
}

function extractJurisdictions(query: string): string[] {
  const jurisdictions: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Common jurisdiction patterns
  const jurisdictionPatterns = [
    { pattern: /\bzambia\w*|\bzambian\w*/gi, jurisdiction: 'zambian' },
    { pattern: /\busas?\w*|\bunited states\w*|\bamerican\w*/gi, jurisdiction: 'usa' },
    { pattern: /\bukw*|\bbritish\w*|\bengland\w*|\bunited kingdom\w*/gi, jurisdiction: 'uk' },
    { pattern: /\bcanada\w*|\bcanadian\w*/gi, jurisdiction: 'canada' },
    { pattern: /\baustralia\w*|\baustralian\w*/gi, jurisdiction: 'australia' },
    { pattern: /\bsouth africa\w*|\bsouth african\w*/gi, jurisdiction: 'south_africa' },
    { pattern: /\bnigeria\w*|\bnigerian\w*/gi, jurisdiction: 'nigeria' },
    { pattern: /\bkenya\w*|\bkenyan\w*/gi, jurisdiction: 'kenya' }
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

function extractTopicsFromQuery(query: string): string[] {
  const topics: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Enhanced topic patterns with better context matching
  const topicPatterns = [
    { 
      pattern: /\bcontract\w*|\bagreement\w*|\boffer\w*|\bacceptance\w*|\bconsideration\w*/gi, 
      topic: 'contract_law',
      context: ['formation', 'breach', 'remedies', 'performance']
    },
    { 
      pattern: /\bproperty\w*|\bland\w*|\bestate\w*|\bownership\w*|\bpossession\w*|\badverse possession\w*/gi, 
      topic: 'property_law',
      context: ['title', 'ownership', 'possession', 'adverse possession']
    },
    { 
      pattern: /\btort\w*|\bnegligence\w*|\bliability\w*|\bdamages\w*/gi, 
      topic: 'tort_law',
      context: ['negligence', 'duty', 'causation', 'damages']
    },
    { 
      pattern: /\bcriminal\w*|\bcrime\w*|\boffense\w*|\boffence\w*/gi, 
      topic: 'criminal_law',
      context: ['elements', 'prosecution', 'defense', 'evidence']
    },
    { 
      pattern: /\bconstitutional\w*|\brights\w*|\bfreedom\w*|\bdue process\w*/gi, 
      topic: 'constitutional_law',
      context: ['rights', 'powers', 'freedoms', 'due process']
    },
    { 
      pattern: /\bcyber\w*|\bdigital\w*|\belectronic\w*|\bdata\w*|\btechnology\w*/gi, 
      topic: 'cyber_law',
      context: ['digital evidence', 'cybercrime', 'data protection']
    },
    { 
      pattern: /\bevidence\w*|\bproof\w*|\badmissibility\w*|\btestimony\w*/gi, 
      topic: 'evidence_law',
      context: ['admissibility', 'burden of proof', 'testimony']
    },
    { 
      pattern: /\bprivacy\w*|\bdata protection\w*|\bconfidentiality\w*/gi, 
      topic: 'privacy_law',
      context: ['data protection', 'confidentiality', 'consent']
    },
    { 
      pattern: /\bestoppel\w*/gi, 
      topic: 'estoppel_law',
      context: ['promissory', 'proprietary', 'representation']
    },
    { 
      pattern: /\bforce majeure\w*|\bimpossibility\w*|\bfrustration\w*/gi, 
      topic: 'force_majeure',
      context: ['impossibility', 'frustration', 'unforeseen events']
    }
  ];
  
  topicPatterns.forEach(({ pattern, topic, context }) => {
    if (pattern.test(query)) {
      // Check if context words are also present for better accuracy
      const hasContext = context.some(contextWord => 
        lowerQuery.includes(contextWord.toLowerCase())
      );
      
      if (hasContext || !topics.includes(topic)) {
        topics.push(topic);
      }
    }
  });
  
  return topics.length > 0 ? topics : ['general_law'];
}

function determineComparisonType(query: string): ComparisonCriteria['comparisonType'] {
  const lowerQuery = query.toLowerCase();
  
  if (/\bdefin\w*|\bmeaning\w*|\bwhat is\w*|\bexplain\w*|\belements?\w*/i.test(query)) {
    return 'definition';
  } else if (/\bpenalt\w*|\bsanction\w*|\bpunishment\w*|\bfine\w*|\bimprisonment\w*/i.test(query)) {
    return 'penalties';
  } else if (/\bprocedure\w*|\bprocess\w*|\bsteps\w*|\bhow to\w*|\brequirements?\w*/i.test(query)) {
    return 'procedures';
  } else if (/\bscope\w*|\bapplication\w*|\bcoverage\w*|\bextent\w*/i.test(query)) {
    return 'scope';
  } else if (/\benforcement\w*|\bimplementation\w*|\bcompliance\w*/i.test(query)) {
    return 'enforcement';
  }
  
  return 'general';
}

function extractSpecificAspects(query: string): string[] {
  const aspects: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  const aspectPatterns = [
    'adverse possession', 'estoppel', 'force majeure', 'consideration', 'breach remedies',
    'chain of custody', 'hash verification', 'authentication methods',
    'burden of proof', 'admissibility', 'expert testimony',
    'constitutional rights', 'due process', 'equal protection',
    'liability', 'damages', 'causation', 'duty of care',
    'termination clauses', 'formation elements', 'interpretation',
    'title', 'ownership', 'possession', 'property rights'
  ];
  
  aspectPatterns.forEach(aspect => {
    if (lowerQuery.includes(aspect.toLowerCase())) {
      aspects.push(aspect);
    }
  });
  
  return aspects;
}

function extractLegalDomainsFromQuery(query: string): string[] {
  const domains: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  const domainMap = {
    'contract': ['contract', 'agreement', 'offer', 'acceptance', 'consideration', 'formation'],
    'property': ['property', 'land', 'ownership', 'possession', 'adverse possession', 'title'],
    'tort': ['tort', 'negligence', 'liability', 'damages', 'duty of care'],
    'constitutional': ['constitutional', 'rights', 'freedom', 'due process'],
    'criminal': ['criminal', 'crime', 'prosecution', 'offense', 'offence'],
    'cyberSecurity': ['cyber', 'digital', 'electronic', 'data', 'technology'],
    'evidence': ['evidence', 'proof', 'admissibility', 'testimony'],
    'estoppel': ['estoppel', 'promissory', 'proprietary', 'representation']
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
  let prompt = `You are a legal research expert. Analyze the following query and provide a focused, accurate response based on the legal documents provided.\n\n`;
  
  prompt += `User Query: "${query}"\n\n`;
  
  // Add query-specific guidance
  prompt += getQuerySpecificGuidance(query, criteria);
  
  // Add jurisdiction context if relevant
  if (criteria.jurisdictions.length > 1) {
    prompt += `Jurisdictions to Compare: ${criteria.jurisdictions.join(' vs ')}\n`;
  } else if (criteria.jurisdictions[0] !== 'general') {
    prompt += `Jurisdiction Context: ${criteria.jurisdictions[0]}\n`;
  }
  
  // Add topic focus
  if (criteria.topics.length > 0) {
    prompt += `Legal Topics: ${criteria.topics.join(', ')}\n`;
  }
  
  // Add comparison criteria
  prompt += `Analysis Focus: ${criteria.comparisonType}\n`;
  
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
  prompt += `IMPORTANT: Only analyze the legal domains and topics that are directly relevant to the user's query. Do not include unrelated legal areas.\n\n`;
  
  prompt += getAnalysisRequirements(criteria);
  
  prompt += `\nProvide your response in JSON format with "recommendation", "primaryAnalysis", "secondaryAnalysis", and "technicalDetails" fields.`;
  
  return prompt;
}

function getQuerySpecificGuidance(query: string, criteria: ComparisonCriteria): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('estoppel')) {
    return `FOCUS: This query is specifically about the doctrine of estoppel. Address:
    - Definition and types of estoppel (promissory, proprietary, by representation)
    - Key elements and requirements
    - Relevant case law and applications
    Do NOT include unrelated contract or property law principles unless they directly relate to estoppel.\n\n`;
  }
  
  if (lowerQuery.includes('adverse possession')) {
    return `FOCUS: This query is specifically about adverse possession. Address:
    - Definition and requirements (actual, open, notorious, exclusive, continuous, hostile)
    - Statutory periods and policy rationale
    - Relevant case law on adverse possession
    Do NOT include general property law principles unless they directly relate to adverse possession.\n\n`;
  }
  
  if (lowerQuery.includes('force majeure')) {
    return `FOCUS: This query is specifically about force majeure clauses. Address:
    - Definition and purpose of force majeure clauses
    - How courts interpret these clauses (strict interpretation, express wording, etc.)
    - Relevant case law on force majeure and impossibility
    Do NOT include general contract formation principles unless they directly relate to force majeure.\n\n`;
  }
  
  if (lowerQuery.includes('elements') && lowerQuery.includes('contract')) {
    return `FOCUS: This query is specifically about contract formation elements. Address:
    - Essential elements: offer, acceptance, consideration, intention, capacity, legality
    - How each element is defined and applied
    - Relevant case law on contract formation
    Do NOT include property law analysis.\n\n`;
  }
  
  return `FOCUS: Analyze only the legal domains and concepts that are directly relevant to the user's query. Avoid including unrelated legal areas.\n\n`;
}

function getAnalysisRequirements(criteria: ComparisonCriteria): string {
  let requirements = `Please provide a structured analysis that includes:\n`;
  
  if (criteria.comparisonType === 'definition') {
    requirements += `1. Clear definition of the legal concept with supporting authority\n`;
    requirements += `2. Key elements or requirements\n`;
    requirements += `3. Relevant case law that establishes or clarifies the definition\n`;
    requirements += `4. Practical applications and examples\n`;
  } else if (criteria.comparisonType === 'penalties') {
    requirements += `1. Specific penalty structures and enforcement mechanisms\n`;
    requirements += `2. Relevant statutes and case law on penalties\n`;
    requirements += `3. Comparison of penalty approaches if multiple jurisdictions\n`;
  } else if (criteria.comparisonType === 'procedures') {
    requirements += `1. Step-by-step procedural requirements\n`;
    requirements += `2. Timelines and deadlines where relevant\n`;
    requirements += `3. Relevant procedural rules and case law\n`;
  } else {
    requirements += `1. Key legal principles and their application\n`;
    requirements += `2. Relevant case law and statutory authority\n`;
    requirements += `3. Practical implications and examples\n`;
    requirements += `4. Clear citations to legal authorities\n`;
  }
  
  return requirements;
}
