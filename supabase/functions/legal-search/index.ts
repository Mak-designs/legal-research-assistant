
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Legal dataset with case law examples categorized by legal domain
const legalDataset = {
  property: {
    principles: [
      "Property rights derived from possession and use",
      "Adverse possession doctrine requires open, notorious, and continuous possession",
      "Easements and covenants running with the land must be recorded to bind subsequent owners",
      "Fixtures become part of real property under attachment and intent tests",
      "Prior appropriation versus riparian rights in water law",
      "Bundle of rights theory in property ownership"
    ],
    cases: [
      {
        title: "Pierson v. Post (1805)",
        citation: "3 Cai. R. 175, 2 Am. Dec. 264 (N.Y. 1805)",
        description: "Established that mere pursuit does not constitute possession; actual capture or mortal wounding and pursuit creates property rights in wild animals"
      },
      {
        title: "Johnson v. M'Intosh (1823)",
        citation: "21 U.S. 543",
        description: "Addressed indigenous property rights; established that discovery gives exclusive right to acquire land from native inhabitants"
      },
      {
        title: "Armory v. Delamirie (1722)",
        citation: "93 Eng. Rep. 664, 1 Strange 505",
        description: "Established that a finder of property has rights against everyone except the true owner"
      },
      {
        title: "International News Service v. Associated Press (1918)",
        citation: "248 U.S. 215",
        description: "Recognized quasi-property rights in news, establishing unfair competition doctrine"
      },
      {
        title: "Moore v. Regents of the University of California (1990)",
        citation: "51 Cal. 3d.120",
        description: "Determined that individuals don't retain property rights in their cells after they've been removed from their bodies"
      },
      {
        title: "Kelo v. City of New London (2005)",
        citation: "545 U.S. 469",
        description: "Expanded the interpretation of 'public use' in eminent domain cases to include economic development"
      }
    ],
    analysis: "Common law of property centers on principles of possession, use, and the right to exclude others. Courts generally protect established property interests against interference, but balance these rights against public interests such as economic development, environmental protection, and social welfare. The trend in modern property law has been toward more nuanced conceptions of ownership that recognize both private rights and public responsibilities."
  },
  contract: {
    principles: [
      "Mutual assent (meeting of the minds) required for contract formation",
      "Consideration necessary for enforceable agreements",
      "Parole evidence rule restricts evidence of prior agreements",
      "Unconscionable contracts may be voided by courts",
      "Specific performance only available for unique goods/services",
      "Promissory estoppel can create enforceable promises without consideration"
    ],
    cases: [
      {
        title: "Carlill v. Carbolic Smoke Ball Co. (1893)",
        citation: "[1893] 1 QB 256",
        description: "Established that unilateral offers can create binding contracts; advertisement with specific promises can constitute an offer"
      },
      {
        title: "Lucy v. Zehmer (1954)",
        citation: "196 Va. 493",
        description: "Affirmed the objective theory of contract formation; what parties objectively manifest, not subjective intent, determines contract"
      },
      {
        title: "Hadley v. Baxendale (1854)",
        citation: "9 Ex. 341",
        description: "Established foreseeability rule for contract damages; limited to those reasonably foreseeable at time of contract"
      },
      {
        title: "ProCD v. Zeidenberg (1996)",
        citation: "86 F.3d 1447",
        description: "Upheld enforceability of shrinkwrap and clickwrap licenses; terms inside box/package can be binding"
      },
      {
        title: "Jacob & Youngs v. Kent (1921)",
        citation: "230 N.Y. 239",
        description: "Established substantial performance doctrine; slight deviations don't necessarily constitute breach"
      },
      {
        title: "Frigaliment Importing Co. v. B.N.S. Int'l Sales Corp. (1960)",
        citation: "190 F. Supp. 116",
        description: "Classic case on contract interpretation; demonstrates how courts resolve ambiguous terms"
      }
    ],
    analysis: "Contract law focuses on enforcing private agreements that meet specific formation requirements. Courts generally enforce clear agreements between parties with capacity but may intervene in cases of fraud, duress, or unconscionable terms. Modern contract law increasingly recognizes power imbalances between parties and provides greater protections for consumers and employees against unfair contract terms."
  },
  tort: {
    principles: [
      "Duty of reasonable care owed to foreseeable plaintiffs",
      "Causation requires both factual (but-for) and proximate (legal) cause",
      "Negligence per se applies when defendant violates a safety statute",
      "Strict liability applies to abnormally dangerous activities",
      "Contributory and comparative negligence affect recovery",
      "Assumption of risk may bar recovery for known dangers"
    ],
    cases: [
      {
        title: "Donoghue v. Stevenson (1932)",
        citation: "[1932] UKHL 100",
        description: "Established manufacturer's duty of care to ultimate consumers; created the 'neighbor principle' in negligence law"
      },
      {
        title: "Palsgraf v. Long Island Railroad Co. (1928)",
        citation: "248 N.Y. 339",
        description: "Limited duty of care to foreseeable plaintiffs; established proximate cause limitations"
      },
      {
        title: "MacPherson v. Buick Motor Co. (1916)",
        citation: "217 N.Y. 382",
        description: "Abolished privity requirement in product liability; manufacturers liable to remote purchasers"
      },
      {
        title: "Tarasoff v. Regents of the University of California (1976)",
        citation: "17 Cal.3d 425",
        description: "Established duty to warn identifiable third parties of specific threats made by patients"
      },
      {
        title: "United States v. Carroll Towing Co. (1947)",
        citation: "159 F.2d 169",
        description: "Introduced the Hand Formula (B<PL) for determining negligence; balancing approach"
      },
      {
        title: "Liebeck v. McDonald's Restaurants (1994)",
        citation: "1994 Extra LEXIS 23 (Bernalillo County, N.M. Dist. Ct. 1994)",
        description: "Famous hot coffee case; addressed product liability and punitive damages for corporate negligence"
      }
    ],
    analysis: "Tort law is primarily concerned with compensating those harmed by others' unreasonable conduct or dangerous activities. Courts balance competing interests including victim compensation, deterrence of harmful behavior, moral blameworthiness, and economic efficiency. Modern tort law has evolved to address new harms including privacy violations, emotional distress, and environmental damage."
  },
  constitutional: {
    principles: [
      "Judicial review allows courts to invalidate unconstitutional laws",
      "Separation of powers divides authority between branches",
      "Federalism balances state and federal authority",
      "Equal protection requires similar treatment of similarly situated persons",
      "Substantive due process protects fundamental rights",
      "First Amendment provides robust speech and religious protections"
    ],
    cases: [
      {
        title: "Marbury v. Madison (1803)",
        citation: "5 U.S. 137",
        description: "Established judicial review; Supreme Court can declare laws unconstitutional"
      },
      {
        title: "Brown v. Board of Education (1954)",
        citation: "347 U.S. 483",
        description: "Overturned 'separate but equal' doctrine; segregated schools inherently unequal"
      },
      {
        title: "Roe v. Wade (1973)",
        citation: "410 U.S. 113",
        description: "Recognized constitutional right to abortion based on privacy rights"
      },
      {
        title: "Obergefell v. Hodges (2015)",
        citation: "576 U.S. 644",
        description: "Established constitutional right to same-sex marriage"
      },
      {
        title: "Citizens United v. Federal Election Commission (2010)",
        citation: "558 U.S. 310",
        description: "Extended First Amendment protection to political spending by corporations and unions"
      },
      {
        title: "District of Columbia v. Heller (2008)",
        citation: "554 U.S. 570",
        description: "Affirmed individual right to possess firearms independent of militia service"
      }
    ],
    analysis: "Constitutional law establishes the fundamental legal framework and limits on government power. Courts must balance textual interpretation, original understanding, precedent, and evolving societal needs when applying constitutional principles. Constitutional jurisprudence continues to evolve in response to new technologies, changing social norms, and emerging challenges to rights and governmental authority."
  },
  criminal: {
    principles: [
      "Beyond reasonable doubt standard of proof",
      "Mens rea (guilty mind) generally required for criminal liability",
      "Fourth Amendment prohibits unreasonable searches and seizures",
      "Fifth Amendment protects against self-incrimination",
      "Sixth Amendment guarantees right to counsel and jury trial",
      "Double jeopardy prohibits multiple prosecutions for same offense"
    ],
    cases: [
      {
        title: "Miranda v. Arizona (1966)",
        citation: "384 U.S. 436",
        description: "Required police to inform suspects of rights to remain silent and to an attorney"
      },
      {
        title: "Gideon v. Wainwright (1963)",
        citation: "372 U.S. 335",
        description: "Established right to counsel for indigent defendants in criminal cases"
      },
      {
        title: "Terry v. Ohio (1968)",
        citation: "392 U.S. 1",
        description: "Permitted 'stop and frisk' based on reasonable suspicion rather than probable cause"
      },
      {
        title: "Carpenter v. United States (2018)",
        citation: "138 S. Ct. 2206",
        description: "Extended Fourth Amendment protection to cell phone location data"
      },
      {
        title: "Brady v. Maryland (1963)",
        citation: "373 U.S. 83",
        description: "Required prosecution to disclose exculpatory evidence to defense"
      },
      {
        title: "Furman v. Georgia (1972)",
        citation: "408 U.S. 238",
        description: "Temporarily invalidated death penalty as applied; addressed arbitrariness concerns"
      }
    ],
    analysis: "Criminal law balances society's interest in public safety with protection of individual rights. Courts have expanded procedural protections for defendants while allowing law enforcement reasonable tools to investigate crimes. Modern criminal jurisprudence increasingly considers factors like rehabilitation, racial disparities in enforcement, and proportionality of punishments."
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    // Function to analyze query and determine relevant legal domains
    const analyzeQuery = (searchQuery) => {
      // Keywords associated with each legal domain
      const domainKeywords = {
        property: ['property', 'land', 'ownership', 'real estate', 'deed', 'easement', 'adverse possession', 'fixture', 'landlord', 'tenant', 'lease', 'conveyance', 'title'],
        contract: ['contract', 'agreement', 'breach', 'terms', 'clause', 'offer', 'acceptance', 'consideration', 'performance', 'damages', 'warranty', 'promissory'],
        tort: ['injury', 'negligence', 'liability', 'damages', 'tort', 'duty', 'harm', 'causation', 'defamation', 'nuisance', 'trespass', 'malpractice'],
        constitutional: ['constitution', 'amendment', 'rights', 'freedom', 'equal protection', 'due process', 'judicial review', 'commerce clause', 'speech', 'religion'],
        criminal: ['crime', 'arrest', 'prosecution', 'guilty', 'innocent', 'evidence', 'search', 'seizure', 'miranda', 'felony', 'misdemeanor', 'punishment']
      };
      
      // Count keyword matches for each domain
      const domainMatches = {};
      
      for (const [domain, keywords] of Object.entries(domainKeywords)) {
        domainMatches[domain] = 0;
        for (const keyword of keywords) {
          if (searchQuery.toLowerCase().includes(keyword.toLowerCase())) {
            domainMatches[domain]++;
          }
        }
      }
      
      // Find the domains with the highest match count
      const maxMatches = Math.max(...Object.values(domainMatches));
      const primaryDomains = Object.keys(domainMatches).filter(domain => domainMatches[domain] === maxMatches);
      
      // If no specific matches, return the two fundamental areas
      if (maxMatches === 0 || searchQuery.toLowerCase().includes('common law') || searchQuery.toLowerCase().includes('contract law')) {
        return ['property', 'contract'];
      }
      
      // If we have a specific match, return that domain plus a related domain
      if (primaryDomains.length === 1) {
        const secondaryDomains = Object.keys(domainMatches)
          .filter(domain => domain !== primaryDomains[0])
          .sort((a, b) => domainMatches[b] - domainMatches[a]);
        
        return [primaryDomains[0], secondaryDomains[0] || 'contract'];
      }
      
      // If multiple domains match equally, take the top two
      return primaryDomains.slice(0, 2);
    };
    
    // Analyze query to determine relevant legal domains
    const relevantDomains = analyzeQuery(query);
    
    // Organize data for response, with primary and secondary domains
    const primaryDomain = relevantDomains[0];
    const secondaryDomain = relevantDomains[1] || 'contract';
    
    // Determine relevance labels based on match
    const primaryRelevance = "High relevance";
    const secondaryRelevance = relevantDomains.length > 1 ? "Medium relevance" : "Low relevance";
    
    // Generate a tailored recommendation based on the query and domains
    const generateRecommendation = (query, primaryDomain, secondaryDomain) => {
      if (primaryDomain === 'property') {
        return `Based on your property-related query, we recommend focusing on the common law principles of ownership and possession. The cases of ${legalDataset.property.cases[0].title} and ${legalDataset.property.cases[1].title} may be particularly relevant. For a comprehensive analysis, you should also consult ${legalDataset[secondaryDomain].cases[0].title} to understand how ${secondaryDomain} law might interact with property interests.`;
      } else if (primaryDomain === 'contract') {
        return `Your question involves contractual matters where principles such as mutual assent and consideration are central. Review ${legalDataset.contract.cases[0].title} and ${legalDataset.contract.cases[1].title} for foundational contract principles. Also consider how ${secondaryDomain} law might impact contractual obligations, particularly as discussed in ${legalDataset[secondaryDomain].cases[0].title}.`;
      } else if (primaryDomain === 'tort') {
        return `Your inquiry relates to tort law, which focuses on civil wrongs and liability. The cases of ${legalDataset.tort.cases[0].title} and ${legalDataset.tort.cases[1].title} establish key principles about duty of care and proximate cause. Consider also how ${secondaryDomain} principles might affect liability, as illustrated in ${legalDataset[secondaryDomain].cases[0].title}.`;
      } else if (primaryDomain === 'constitutional') {
        return `Your question involves constitutional principles that define governmental powers and individual rights. ${legalDataset.constitutional.cases[0].title} and ${legalDataset.constitutional.cases[1].title} provide essential background. Also consider how ${secondaryDomain} law intersects with constitutional principles, as shown in ${legalDataset[secondaryDomain].cases[0].title}.`;
      } else if (primaryDomain === 'criminal') {
        return `Your inquiry touches on criminal law matters where procedural protections and substantive elements are critical. ${legalDataset.criminal.cases[0].title} and ${legalDataset.criminal.cases[1].title} establish key principles in this area. Also review how ${secondaryDomain} concepts might influence criminal proceedings, particularly as discussed in ${legalDataset[secondaryDomain].cases[0].title}.`;
      }
      
      return `Based on your legal research query, we recommend exploring both ${primaryDomain} law and ${secondaryDomain} law principles. Begin with foundational cases in each area and consider how these domains interact in your specific scenario.`;
    };
    
    const results = {
      query: query,
      timestamp: new Date().toISOString(),
      comparison: {
        commonLaw: {
          principles: legalDataset[primaryDomain].principles,
          relevance: primaryRelevance + " to " + query,
          caseExamples: legalDataset[primaryDomain].cases.slice(0, 3).map(c => `${c.title} - ${c.description}`),
          analysis: legalDataset[primaryDomain].analysis
        },
        contractLaw: {
          principles: legalDataset[secondaryDomain].principles,
          relevance: secondaryRelevance + " to " + query,
          caseExamples: legalDataset[secondaryDomain].cases.slice(0, 3).map(c => `${c.title} - ${c.description}`),
          analysis: legalDataset[secondaryDomain].analysis
        }
      },
      recommendation: generateRecommendation(query, primaryDomain, secondaryDomain)
    };
    
    console.log(`Processed legal query: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}`);
    
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in legal search:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
