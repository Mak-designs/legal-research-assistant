
import { legalDataset } from './legalDataset.ts';

export const analyzeQuery = (searchQuery: string) => {
  // Keywords associated with each legal domain
  const domainKeywords = {
    property: ['property', 'land', 'ownership', 'real estate', 'deed', 'easement', 'adverse possession', 'fixture', 'landlord', 'tenant', 'lease', 'conveyance', 'title', 'possessory'],
    contract: ['contract', 'agreement', 'breach', 'terms', 'clause', 'offer', 'acceptance', 'consideration', 'performance', 'damages', 'warranty', 'promissory', 'bargain', 'exchange'],
    tort: ['injury', 'negligence', 'liability', 'damages', 'tort', 'duty', 'harm', 'causation', 'defamation', 'nuisance', 'trespass', 'malpractice', 'battery', 'assault'],
    constitutional: ['constitution', 'amendment', 'rights', 'freedom', 'equal protection', 'due process', 'judicial review', 'commerce clause', 'speech', 'religion', 'privacy', 'liberty'],
    criminal: ['crime', 'arrest', 'prosecution', 'guilty', 'innocent', 'evidence', 'search', 'seizure', 'miranda', 'felony', 'misdemeanor', 'punishment', 'incarceration', 'defendant'],
    zambian: ['zambia', 'zambian', 'lusaka', 'ndola', 'customary law', 'traditional', 'chieftaincy', 'african law', 'southern africa', 'common law', 'english law', 'constitution of zambia', 'supreme court of zambia', 'high court'],
    cyberSecurity: ['digital evidence', 'hash', 'md5', 'sha-256', 'blockchain', 'metadata', 'forensic', 'chain of custody', 'electronic', 'authentication', 'verification', 'digital signature', 'tampering', 'integrity', 'cyber', 'cybersecurity']
  };
  
  // Count keyword matches for each domain with weighted scoring
  const domainMatches = {};
  const words = searchQuery.toLowerCase().split(/\s+/);
  
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    domainMatches[domain] = 0;
    
    // Check for exact keyword matches
    for (const keyword of keywords) {
      if (searchQuery.toLowerCase().includes(keyword.toLowerCase())) {
        domainMatches[domain] += 1;
      }
      
      // Give additional weight to terms that are standalone words
      if (words.includes(keyword.toLowerCase())) {
        domainMatches[domain] += 0.5;
      }
    }
    
    // Check for case names in the domain
    for (const caseObj of legalDataset[domain]?.cases || []) {
      if (searchQuery.toLowerCase().includes(caseObj.title.toLowerCase())) {
        domainMatches[domain] += 2;
      }
    }
    
    // Check for statute names in the domain
    for (const statute of legalDataset[domain]?.statutes || []) {
      if (searchQuery.toLowerCase().includes(statute.title.toLowerCase())) {
        domainMatches[domain] += 2;
      }
    }
  }
  
  // Find the domains with the highest match count
  const maxMatches = Math.max(...Object.values(domainMatches));
  const primaryDomains = Object.keys(domainMatches).filter(domain => domainMatches[domain] === maxMatches);
  
  if (maxMatches === 0) {
    if (searchQuery.toLowerCase().includes('zambia') || searchQuery.toLowerCase().includes('zambian')) {
      return ['zambian', 'constitutional'];
    } else if (searchQuery.toLowerCase().includes('digital') || searchQuery.toLowerCase().includes('evidence') || searchQuery.toLowerCase().includes('cyber')) {
      return ['cyberSecurity', 'zambian'];
    } else if (searchQuery.toLowerCase().includes('common law')) {
      return ['property', 'tort'];
    } else if (searchQuery.toLowerCase().includes('contract law')) {
      return ['contract', 'commercial'];
    } else {
      return ['constitutional', 'property'];
    }
  }
  
  if (primaryDomains.length === 1) {
    const secondaryDomains = Object.keys(domainMatches)
      .filter(domain => domain !== primaryDomains[0])
      .sort((a, b) => domainMatches[b] - domainMatches[a]);
    
    return [primaryDomains[0], secondaryDomains[0] || 'contract'];
  }
  
  return primaryDomains.slice(0, 2);
};
