
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced legal dataset with real case law examples and statutes
const legalDataset = {
  property: {
    principles: [
      "Property rights derived from possession and use",
      "Adverse possession requires open, notorious, and continuous possession",
      "Easements and covenants running with the land must be recorded to bind subsequent owners",
      "Fixtures become part of real property under attachment and intent tests",
      "Prior appropriation versus riparian rights in water law",
      "Bundle of rights theory in property ownership"
    ],
    cases: [
      {
        title: "Pierson v. Post",
        citation: "3 Cai. R. 175 (N.Y. 1805)",
        description: "Established that mere pursuit does not constitute possession; actual capture or mortal wounding and pursuit creates property rights in wild animals"
      },
      {
        title: "Johnson v. M'Intosh",
        citation: "21 U.S. 543 (1823)",
        description: "Addressed indigenous property rights; established that discovery gives exclusive right to acquire land from native inhabitants"
      },
      {
        title: "Ghen v. Rich",
        citation: "8 F. 159 (D. Mass. 1881)",
        description: "Custom may determine property rights; whaler who killed whale had rights to it when found by another under local custom"
      },
      {
        title: "Moore v. Regents of University of California",
        citation: "51 Cal. 3d 120 (1990)",
        description: "Individuals don't retain property rights in cells removed from their bodies for medical research"
      },
      {
        title: "Kelo v. City of New London",
        citation: "545 U.S. 469 (2005)",
        description: "Economic development qualifies as 'public use' under the Takings Clause of the Fifth Amendment"
      },
      {
        title: "Lucas v. South Carolina Coastal Council",
        citation: "505 U.S. 1003 (1992)",
        description: "Regulatory action that deprives land of all economically beneficial use constitutes a taking requiring compensation"
      }
    ],
    statutes: [
      {
        title: "Uniform Residential Landlord and Tenant Act",
        citation: "URLTA (1972)",
        description: "Governs landlord-tenant relationships in residential properties; adopted in various forms by many states"
      },
      {
        title: "Statute of Frauds",
        citation: "29 Car. II c. 3 (1677)",
        description: "Requires certain contracts, including those for the sale of land, to be in writing to be enforceable"
      },
      {
        title: "Fair Housing Act",
        citation: "42 U.S.C. §§ 3601-3619",
        description: "Prohibits discrimination in housing based on race, color, national origin, religion, sex, familial status, or disability"
      },
      {
        title: "Uniform Commercial Code Article 9",
        citation: "UCC Art. 9",
        description: "Governs secured transactions in personal property, including fixtures"
      }
    ],
    analysis: "Property law balances individual ownership rights with social needs and public interests. Contemporary issues include digital property, intellectual property rights, and environmental regulations limiting traditional property use. Courts increasingly recognize the social function of property while preserving core ownership protections."
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
        title: "Carlill v. Carbolic Smoke Ball Co.",
        citation: "[1893] 1 QB 256",
        description: "Established that unilateral offers can create binding contracts when accepted through performance"
      },
      {
        title: "Hawkins v. McGee",
        citation: "84 N.H. 114 (1929)",
        description: "The 'hairy hand' case establishing expectation damages in contract breach; damages should put plaintiff in position as if contract performed"
      },
      {
        title: "Hadley v. Baxendale",
        citation: "9 Ex. 341 (1854)",
        description: "Established foreseeability rule for contract damages; limited to those reasonably foreseeable at time of contract"
      },
      {
        title: "Leonard v. Pepsico, Inc.",
        citation: "88 F. Supp. 2d 116 (S.D.N.Y. 1999)",
        description: "Advertisements generally considered invitations to negotiate rather than offers; Pepsi Harrier Jet commercial was obviously a joke"
      },
      {
        title: "Pennzoil v. Texaco",
        citation: "481 U.S. 1 (1987)",
        description: "Highlighted tortious interference with contract; resulted in $10.53 billion verdict (largest in history at that time)"
      },
      {
        title: "Hoffman v. Red Owl Stores",
        citation: "26 Wis. 2d 683 (1965)",
        description: "Applied promissory estoppel where franchise agreement negotiations caused plaintiff to take detrimental actions"
      }
    ],
    statutes: [
      {
        title: "Uniform Commercial Code Article 2",
        citation: "UCC Art. 2",
        description: "Governs contracts for the sale of goods; adopted with variations by all U.S. states except Louisiana"
      },
      {
        title: "Uniform Electronic Transactions Act",
        citation: "UETA (1999)",
        description: "Provides that electronic signatures and records have the same legal effect as traditional written documents"
      },
      {
        title: "Statute of Frauds",
        citation: "Varies by state",
        description: "Requires certain types of contracts to be in writing to be enforceable"
      },
      {
        title: "Magnuson-Moss Warranty Act",
        citation: "15 U.S.C. § 2301 et seq.",
        description: "Federal law governing warranties on consumer products"
      }
    ],
    analysis: "Contract law prioritizes parties' freedom to define their obligations while courts intervene to prevent exploitation of unequal bargaining power. Modern developments include electronic contracts, standardized agreements, and growing consumer protections. Courts increasingly scrutinize boilerplate terms and adhesion contracts."
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
        title: "Palsgraf v. Long Island Railroad Co.",
        citation: "248 N.Y. 339 (1928)",
        description: "Defined scope of duty; liability limited to foreseeable plaintiffs within zone of danger"
      },
      {
        title: "MacPherson v. Buick Motor Co.",
        citation: "217 N.Y. 382 (1916)",
        description: "Eliminated privity requirement in product liability; manufacturers liable to end users for negligently made products"
      },
      {
        title: "Tarasoff v. Regents of University of California",
        citation: "17 Cal. 3d 425 (1976)",
        description: "Established duty to warn identifiable third parties of specific threats from patients"
      },
      {
        title: "New York Times Co. v. Sullivan",
        citation: "376 U.S. 254 (1964)",
        description: "Established 'actual malice' standard for defamation claims by public officials"
      },
      {
        title: "Wyeth v. Levine",
        citation: "555 U.S. 555 (2009)",
        description: "Pharmaceutical manufacturer not shielded from state tort liability by FDA approval"
      },
      {
        title: "State Farm Mutual Auto Insurance Co. v. Campbell",
        citation: "538 U.S. 408 (2003)",
        description: "Limited punitive damages to typically within single-digit ratio to compensatory damages"
      }
    ],
    statutes: [
      {
        title: "Federal Tort Claims Act",
        citation: "28 U.S.C. §§ 1346(b), 2671-2680",
        description: "Permits private parties to sue the United States for torts committed by federal employees"
      },
      {
        title: "Americans with Disabilities Act",
        citation: "42 U.S.C. § 12101 et seq.",
        description: "Prohibits discrimination against individuals with disabilities; creates tort-like remedies"
      },
      {
        title: "Comprehensive Environmental Response, Compensation, and Liability Act",
        citation: "42 U.S.C. § 9601 et seq.",
        description: "Establishes liability framework for hazardous waste sites (Superfund)"
      },
      {
        title: "Protection of Lawful Commerce in Arms Act",
        citation: "15 U.S.C. §§ 7901-7903",
        description: "Provides immunity to firearms manufacturers and dealers from certain tort lawsuits"
      }
    ],
    analysis: "Tort law continues evolving to address emerging harms like privacy violations, emotional distress, and environmental damage. Courts balance compensation for harm against costs of imposing liability on innovators and businesses. Tort reform movements seek to limit damages while consumer advocates aim to preserve tort system's deterrent effects."
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
        title: "Marbury v. Madison",
        citation: "5 U.S. 137 (1803)",
        description: "Established judicial review; Supreme Court can declare laws unconstitutional"
      },
      {
        title: "Brown v. Board of Education",
        citation: "347 U.S. 483 (1954)",
        description: "Overturned 'separate but equal' doctrine; segregated schools inherently unequal"
      },
      {
        title: "United States v. Windsor",
        citation: "570 U.S. 744 (2013)",
        description: "Struck down Defense of Marriage Act as unconstitutional under Fifth Amendment's Due Process Clause"
      },
      {
        title: "Citizens United v. Federal Election Commission",
        citation: "558 U.S. 310 (2010)",
        description: "Extended First Amendment protection to political speech by corporations and unions"
      },
      {
        title: "District of Columbia v. Heller",
        citation: "554 U.S. 570 (2008)",
        description: "Affirmed individual right to possess firearms independent of militia service"
      },
      {
        title: "Dobbs v. Jackson Women's Health Organization",
        citation: "597 U.S. ___ (2022)",
        description: "Overturned Roe v. Wade; held Constitution does not confer right to abortion"
      }
    ],
    statutes: [
      {
        title: "Civil Rights Act of 1964",
        citation: "42 U.S.C. § 2000e et seq.",
        description: "Prohibits discrimination based on race, color, religion, sex, or national origin"
      },
      {
        title: "Voting Rights Act of 1965",
        citation: "52 U.S.C. § 10101 et seq.",
        description: "Prohibits racial discrimination in voting; key civil rights legislation"
      },
      {
        title: "Religious Freedom Restoration Act",
        citation: "42 U.S.C. § 2000bb et seq.",
        description: "Prohibits government from substantially burdening religious exercise without compelling interest"
      },
      {
        title: "USA PATRIOT Act",
        citation: "Pub. L. 107-56",
        description: "Expanded surveillance powers of law enforcement agencies; raised constitutional concerns"
      }
    ],
    analysis: "Constitutional law establishes the fundamental legal framework and limits on government power. Courts balance textual interpretation, original understanding, precedent, and evolving societal needs. Constitutional jurisprudence continues evolving on issues including privacy rights, executive power, and corporate personhood."
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
        title: "Miranda v. Arizona",
        citation: "384 U.S. 436 (1966)",
        description: "Required police to inform suspects of rights to remain silent and to an attorney"
      },
      {
        title: "Gideon v. Wainwright",
        citation: "372 U.S. 335 (1963)",
        description: "Established right to counsel for indigent defendants in criminal cases"
      },
      {
        title: "Carpenter v. United States",
        citation: "138 S. Ct. 2206 (2018)",
        description: "Extended Fourth Amendment protection to cell phone location data"
      },
      {
        title: "Terry v. Ohio",
        citation: "392 U.S. 1 (1968)",
        description: "Permitted 'stop and frisk' based on reasonable suspicion rather than probable cause"
      },
      {
        title: "Brady v. Maryland",
        citation: "373 U.S. 83 (1963)",
        description: "Required prosecution to disclose exculpatory evidence to defense"
      },
      {
        title: "Roper v. Simmons",
        citation: "543 U.S. 551 (2005)",
        description: "Prohibited death penalty for crimes committed by those under 18"
      }
    ],
    statutes: [
      {
        title: "Model Penal Code",
        citation: "MPC (1962)",
        description: "Influential model statute codifying criminal law; widely adopted with variations"
      },
      {
        title: "Racketeer Influenced and Corrupt Organizations Act",
        citation: "18 U.S.C. §§ 1961-1968",
        description: "Federal law providing extended penalties for organized crime activities"
      },
      {
        title: "First Step Act",
        citation: "Pub. L. 115-391",
        description: "Criminal justice reform bill reducing federal prison sentences and expanding early release programs"
      },
      {
        title: "Computer Fraud and Abuse Act",
        citation: "18 U.S.C. § 1030",
        description: "Criminalizes unauthorized access to protected computers; controversial scope"
      }
    ],
    analysis: "Criminal law balances public safety with defendant rights. Recent reforms focus on reducing mass incarceration, addressing racial disparities, and implementing alternatives to incarceration. Criminal jurisprudence increasingly confronts technology issues like digital privacy and cybercrime."
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    // Enhanced function to analyze query and determine relevant legal domains
    const analyzeQuery = (searchQuery) => {
      // Keywords associated with each legal domain
      const domainKeywords = {
        property: ['property', 'land', 'ownership', 'real estate', 'deed', 'easement', 'adverse possession', 'fixture', 'landlord', 'tenant', 'lease', 'conveyance', 'title', 'possessory'],
        contract: ['contract', 'agreement', 'breach', 'terms', 'clause', 'offer', 'acceptance', 'consideration', 'performance', 'damages', 'warranty', 'promissory', 'bargain', 'exchange'],
        tort: ['injury', 'negligence', 'liability', 'damages', 'tort', 'duty', 'harm', 'causation', 'defamation', 'nuisance', 'trespass', 'malpractice', 'battery', 'assault'],
        constitutional: ['constitution', 'amendment', 'rights', 'freedom', 'equal protection', 'due process', 'judicial review', 'commerce clause', 'speech', 'religion', 'privacy', 'liberty'],
        criminal: ['crime', 'arrest', 'prosecution', 'guilty', 'innocent', 'evidence', 'search', 'seizure', 'miranda', 'felony', 'misdemeanor', 'punishment', 'incarceration', 'defendant']
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
        for (const caseObj of legalDataset[domain].cases) {
          if (searchQuery.toLowerCase().includes(caseObj.title.toLowerCase())) {
            domainMatches[domain] += 2; // Strong signal if a specific case is mentioned
          }
        }
        
        // Check for statute names in the domain
        for (const statute of legalDataset[domain].statutes) {
          if (searchQuery.toLowerCase().includes(statute.title.toLowerCase())) {
            domainMatches[domain] += 2; // Strong signal if a specific statute is mentioned
          }
        }
      }
      
      // Find the domains with the highest match count
      const maxMatches = Math.max(...Object.values(domainMatches));
      const primaryDomains = Object.keys(domainMatches).filter(domain => domainMatches[domain] === maxMatches);
      
      // If no specific matches, return the two fundamental areas
      if (maxMatches === 0) {
        if (searchQuery.toLowerCase().includes('common law')) {
          return ['property', 'tort'];
        } else if (searchQuery.toLowerCase().includes('contract law')) {
          return ['contract', 'commercial'];
        } else {
          return ['constitutional', 'property']; // Default to these two fundamental areas
        }
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
      const primaryCases = legalDataset[primaryDomain].cases;
      const secondaryCases = legalDataset[secondaryDomain].cases;
      const primaryStatutes = legalDataset[primaryDomain].statutes;
      
      return `Based on your query about "${query}", we recommend examining ${primaryCases[0].title} (${primaryCases[0].citation}) and ${primaryCases[1].title} (${primaryCases[1].citation}) as key cases in ${primaryDomain} law. For statutory guidance, review the ${primaryStatutes[0].title} (${primaryStatutes[0].citation}). To understand how ${secondaryDomain} law principles might interact with this issue, also consider ${secondaryCases[0].title} (${secondaryCases[0].citation}). These sources provide a comprehensive foundation for analyzing your legal question.`;
    };
    
    const results = {
      query: query,
      timestamp: new Date().toISOString(),
      comparison: {
        commonLaw: {
          principles: legalDataset[primaryDomain].principles,
          relevance: primaryRelevance + " to " + query,
          caseExamples: legalDataset[primaryDomain].cases.slice(0, 3).map(c => `${c.title} (${c.citation}) - ${c.description}`),
          statutes: legalDataset[primaryDomain].statutes.slice(0, 2).map(s => `${s.title} (${s.citation}) - ${s.description}`),
          analysis: legalDataset[primaryDomain].analysis
        },
        contractLaw: {
          principles: legalDataset[secondaryDomain].principles,
          relevance: secondaryRelevance + " to " + query,
          caseExamples: legalDataset[secondaryDomain].cases.slice(0, 3).map(c => `${c.title} (${c.citation}) - ${c.description}`),
          statutes: legalDataset[secondaryDomain].statutes.slice(0, 2).map(s => `${s.title} (${s.citation}) - ${s.description}`),
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
