
import { legalDataset } from './legalDataset.ts';

export const analyzeQuery = (searchQuery: string) => {
  // Enhanced keywords associated with each legal domain
  const domainKeywords = {
    property: ['property', 'land', 'ownership', 'real estate', 'deed', 'easement', 'adverse possession', 'fixture', 'landlord', 'tenant', 'lease', 'conveyance', 'title', 'possessory', 'zoning', 'eminent domain', 'fee simple', 'encumbrance', 'covenant', 'easement', 'riparian', 'servitude'],
    contract: ['contract', 'agreement', 'breach', 'terms', 'clause', 'offer', 'acceptance', 'consideration', 'performance', 'damages', 'warranty', 'promissory', 'bargain', 'exchange', 'estoppel', 'duress', 'unconscionable', 'good faith', 'liquidated', 'anticipatory', 'bilateral', 'unilateral', 'void', 'voidable', 'remedy', 'specific performance', 'rescission', 'reformation', 'quasi contract'],
    tort: ['injury', 'negligence', 'liability', 'damages', 'tort', 'duty', 'harm', 'causation', 'defamation', 'nuisance', 'trespass', 'malpractice', 'battery', 'assault', 'strict liability', 'product liability', 'conversion', 'invasion of privacy', 'false imprisonment', 'intentional infliction', 'emotional distress', 'vicarious', 'respondeat superior', 'joint and several'],
    constitutional: ['constitution', 'amendment', 'rights', 'freedom', 'equal protection', 'due process', 'judicial review', 'commerce clause', 'speech', 'religion', 'privacy', 'liberty', 'fundamental', 'strict scrutiny', 'rational basis', 'intermediate scrutiny', 'incorporation', 'federalism', 'separation of powers', 'preemption'],
    criminal: ['crime', 'arrest', 'prosecution', 'guilty', 'innocent', 'evidence', 'search', 'seizure', 'miranda', 'felony', 'misdemeanor', 'punishment', 'incarceration', 'defendant', 'prosecutorial discretion', 'indictment', 'mens rea', 'actus reus', 'beyond reasonable doubt', 'probable cause', 'exclusionary rule', 'self-incrimination', 'brady', 'sentencing'],
    zambian: ['zambia', 'zambian', 'lusaka', 'ndola', 'customary law', 'traditional', 'chieftaincy', 'african law', 'southern africa', 'common law', 'english law', 'constitution of zambia', 'supreme court of zambia', 'high court', 'lusaka agreement', 'zambian evidence act', 'zambian penal code', 'lands act', 'zambian companies act'],
    cyberSecurity: ['digital evidence', 'hash', 'md5', 'sha-256', 'blockchain', 'metadata', 'forensic', 'chain of custody', 'electronic', 'authentication', 'verification', 'digital signature', 'tampering', 'integrity', 'cyber', 'cybersecurity', 'encryption', 'decryption', 'forensic copy', 'write blocker', 'imaging', 'validation', 'certification', 'admissibility', 'digital forensics']
  };
  
  // Improved scoring system with contextual weighting
  const domainMatches = {};
  const words = searchQuery.toLowerCase().split(/\s+/);
  
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    domainMatches[domain] = 0;
    
    // Check for exact keyword matches with increased weight for multi-word phrases
    for (const keyword of keywords) {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      
      if (searchQuery.toLowerCase().includes(keyword.toLowerCase())) {
        // Multi-word phrases get higher weight
        domainMatches[domain] += keywordWords.length * 0.5;
      }
      
      // Give additional weight to terms that are standalone words
      if (words.includes(keyword.toLowerCase())) {
        domainMatches[domain] += 1;
      }
    }
    
    // Check for co-occurrence of related terms to boost relevance
    let relatedTermsCount = 0;
    for (let i = 0; i < keywords.length; i++) {
      if (searchQuery.toLowerCase().includes(keywords[i].toLowerCase())) {
        relatedTermsCount++;
      }
    }
    
    // Logarithmic scaling for multiple related terms
    if (relatedTermsCount > 1) {
      domainMatches[domain] += Math.log2(relatedTermsCount) * 2;
    }
    
    // Check for case names in the domain with higher weight
    for (const caseObj of legalDataset[domain]?.cases || []) {
      if (searchQuery.toLowerCase().includes(caseObj.title.toLowerCase())) {
        domainMatches[domain] += 3;
      }
      
      // Check for partial case name matches
      const caseParts = caseObj.title.toLowerCase().split(/\s+v\.\s+/);
      if (caseParts.length > 1) {
        for (const part of caseParts) {
          if (searchQuery.toLowerCase().includes(part) && part.length > 3) {
            domainMatches[domain] += 1;
          }
        }
      }
    }
    
    // Check for statute names in the domain
    for (const statute of legalDataset[domain]?.statutes || []) {
      if (searchQuery.toLowerCase().includes(statute.title.toLowerCase())) {
        domainMatches[domain] += 3;
      }
      
      // Check for citation matches
      if (statute.citation && searchQuery.toLowerCase().includes(statute.citation.toLowerCase())) {
        domainMatches[domain] += 2;
      }
    }
  }
  
  // Find the domains with the highest match count
  const maxMatches = Math.max(...Object.values(domainMatches));
  
  // Handle case where no strong matches found
  if (maxMatches <= 1) {
    // Enhanced context detection for low-signal queries
    if (searchQuery.toLowerCase().includes('zambia') || searchQuery.toLowerCase().includes('zambian')) {
      return ['zambian', detectSecondaryDomain(searchQuery)];
    } else if (searchQuery.toLowerCase().includes('digital') || searchQuery.toLowerCase().includes('evidence') || searchQuery.toLowerCase().includes('cyber')) {
      return ['cyberSecurity', detectSecondaryDomain(searchQuery, ['cyberSecurity'])];
    } else if (searchQuery.toLowerCase().includes('enforceability') || searchQuery.toLowerCase().includes('agreement') || searchQuery.toLowerCase().includes('breach')) {
      return ['contract', 'property']; 
    } else if (searchQuery.toLowerCase().includes('injury') || searchQuery.toLowerCase().includes('damage') || searchQuery.toLowerCase().includes('compensation')) {
      return ['tort', 'contract'];
    } else if (searchQuery.toLowerCase().includes('property') || searchQuery.toLowerCase().includes('land') || searchQuery.toLowerCase().includes('ownership')) {
      return ['property', 'contract'];
    } else if (searchQuery.toLowerCase().includes('rights') || searchQuery.toLowerCase().includes('freedom') || searchQuery.toLowerCase().includes('amendment')) {
      return ['constitutional', detectSecondaryDomain(searchQuery, ['constitutional'])];
    } else if (searchQuery.toLowerCase().includes('criminal') || searchQuery.toLowerCase().includes('defendant') || searchQuery.toLowerCase().includes('prosecution')) {
      return ['criminal', detectSecondaryDomain(searchQuery, ['criminal'])];
    } else {
      // Default fallback for truly ambiguous queries
      return ['constitutional', 'contract'];
    }
  }
  
  const primaryDomains = Object.keys(domainMatches).filter(domain => domainMatches[domain] === maxMatches);
  
  if (primaryDomains.length === 1) {
    const secondaryDomains = Object.keys(domainMatches)
      .filter(domain => domain !== primaryDomains[0])
      .sort((a, b) => domainMatches[b] - domainMatches[a]);
    
    return [primaryDomains[0], secondaryDomains[0] || 'contract'];
  }
  
  return primaryDomains.slice(0, 2);
};

// Helper function to detect secondary domain
function detectSecondaryDomain(query: string, excludeDomains: string[] = []): string {
  const domainIndicators = {
    'contract': ['agreement', 'offer', 'acceptance', 'consideration', 'breach', 'performance', 'term', 'clause'],
    'property': ['land', 'real estate', 'ownership', 'possession', 'title', 'deed', 'tenant'],
    'tort': ['injury', 'negligence', 'damages', 'harm', 'liability', 'duty', 'causation'],
    'constitutional': ['rights', 'freedom', 'liberty', 'amendment', 'equal protection', 'due process'],
    'criminal': ['crime', 'felony', 'misdemeanor', 'prosecution', 'defendant', 'guilty', 'innocent'],
    'cyberSecurity': ['digital', 'electronic', 'online', 'cyber', 'data', 'hash', 'encryption']
  };

  let bestMatch = 'contract'; // Default fallback
  let bestScore = 0;
  
  for (const [domain, indicators] of Object.entries(domainIndicators)) {
    if (excludeDomains.includes(domain)) continue;
    
    let score = 0;
    for (const indicator of indicators) {
      if (query.toLowerCase().includes(indicator.toLowerCase())) {
        score++;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = domain;
    }
  }
  
  return bestMatch;
}
