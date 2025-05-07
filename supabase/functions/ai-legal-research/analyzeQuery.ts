
// Copy of analyzeQuery function specifically for the ai-legal-research edge function

// Since we don't have direct access to legalDataset from legal-search, 
// we'll create a simplified version for domain detection
const domainKeywords = {
  property: ['property', 'land', 'ownership', 'real estate', 'deed', 'easement', 'adverse possession', 'fixture', 'landlord', 'tenant', 'lease', 'conveyance', 'title', 'possessory', 'zoning', 'eminent domain'],
  contract: ['contract', 'agreement', 'breach', 'terms', 'clause', 'offer', 'acceptance', 'consideration', 'performance', 'damages', 'warranty', 'promissory', 'bargain', 'exchange', 'estoppel', 'duress'],
  tort: ['injury', 'negligence', 'liability', 'damages', 'tort', 'duty', 'harm', 'causation', 'defamation', 'nuisance', 'trespass', 'malpractice', 'battery', 'assault', 'strict liability'],
  constitutional: ['constitution', 'amendment', 'rights', 'freedom', 'equal protection', 'due process', 'judicial review', 'commerce clause', 'speech', 'religion', 'privacy', 'liberty'],
  criminal: ['crime', 'arrest', 'prosecution', 'guilty', 'innocent', 'evidence', 'search', 'seizure', 'miranda', 'felony', 'misdemeanor', 'punishment', 'incarceration'],
  zambian: ['zambia', 'zambian', 'lusaka', 'ndola', 'customary law', 'traditional', 'chieftaincy', 'african law', 'southern africa', 'common law', 'english law'],
  cyberSecurity: ['digital evidence', 'hash', 'md5', 'sha-256', 'blockchain', 'metadata', 'forensic', 'chain of custody', 'electronic', 'authentication', 'verification', 'digital signature']
};

/**
 * Analyze a legal query to determine relevant legal domains
 * @param searchQuery The user's legal query
 * @returns Array with primary and secondary domain names
 */
export const analyzeQuery = (searchQuery: string) => {
  // Scoring system
  const domainMatches: Record<string, number> = {};
  
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    domainMatches[domain] = 0;
    
    // Check for keyword matches
    for (const keyword of keywords) {
      if (searchQuery.toLowerCase().includes(keyword.toLowerCase())) {
        domainMatches[domain] += 1;
      }
    }
  }
  
  // Find the domains with the highest match count
  const maxMatches = Math.max(...Object.values(domainMatches));
  
  // Handle case where no strong matches found
  if (maxMatches <= 1) {
    if (searchQuery.toLowerCase().includes('zambia') || searchQuery.toLowerCase().includes('zambian')) {
      return ['zambian', detectSecondaryDomain(searchQuery)];
    } else if (searchQuery.toLowerCase().includes('digital') || searchQuery.toLowerCase().includes('evidence') || searchQuery.toLowerCase().includes('cyber')) {
      return ['cyberSecurity', detectSecondaryDomain(searchQuery, ['cyberSecurity'])];
    } else if (searchQuery.toLowerCase().includes('contract') || searchQuery.toLowerCase().includes('agreement')) {
      return ['contract', 'property']; 
    } else if (searchQuery.toLowerCase().includes('injury') || searchQuery.toLowerCase().includes('damage')) {
      return ['tort', 'contract'];
    } else if (searchQuery.toLowerCase().includes('property') || searchQuery.toLowerCase().includes('land')) {
      return ['property', 'contract'];
    } else {
      // Default fallback
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
