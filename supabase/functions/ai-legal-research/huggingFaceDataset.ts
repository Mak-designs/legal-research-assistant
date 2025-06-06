// Hugging Face dataset integration for legal research

const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

interface LegalCase {
  id: string;
  title: string;
  citation: string;
  description: string;
  domain: string;
  jurisdiction?: string;
}

interface LegalStatute {
  id: string;
  title: string;
  citation: string;
  description: string;
  domain: string;
  jurisdiction?: string;
}

interface HuggingFaceDatasetResponse {
  data: any[];
  error?: string;
}

/**
 * Fetch legal cases from Hugging Face datasets
 */
export async function fetchLegalCasesFromHF(domain: string, jurisdiction: string = "general"): Promise<LegalCase[]> {
  try {
    console.log(`Fetching legal cases for domain: ${domain}, jurisdiction: ${jurisdiction}`);
    
    // Try multiple legal datasets from Hugging Face
    const datasets = [
      "pile-of-law/pile-of-law",
      "legal-eagle/legal-cases",
      "lexlms/legal-documents"
    ];
    
    for (const dataset of datasets) {
      try {
        const response = await fetch(`https://datasets-server.huggingface.co/rows?dataset=${dataset}&config=default&split=train&offset=0&length=20`, {
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Successfully fetched data from ${dataset}`);
          
          return processCasesData(data.rows || [], domain);
        }
      } catch (error) {
        console.log(`Failed to fetch from ${dataset}:`, error.message);
        continue;
      }
    }
    
    // Fallback to legal text datasets if case datasets are not available
    return await fetchLegalTextsFromHF(domain, "cases");
    
  } catch (error) {
    console.error("Error fetching legal cases from Hugging Face:", error);
    return getFallbackCases(domain);
  }
}

/**
 * Fetch legal statutes from Hugging Face datasets
 */
export async function fetchLegalStatutesFromHF(domain: string, jurisdiction: string = "general"): Promise<LegalStatute[]> {
  try {
    console.log(`Fetching legal statutes for domain: ${domain}, jurisdiction: ${jurisdiction}`);
    
    const datasets = [
      "pile-of-law/pile-of-law",
      "legal-eagle/statutes",
      "lexlms/legal-codes"
    ];
    
    for (const dataset of datasets) {
      try {
        const response = await fetch(`https://datasets-server.huggingface.co/rows?dataset=${dataset}&config=default&split=train&offset=0&length=15`, {
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Successfully fetched statutes from ${dataset}`);
          
          return processStatutesData(data.rows || [], domain);
        }
      } catch (error) {
        console.log(`Failed to fetch statutes from ${dataset}:`, error.message);
        continue;
      }
    }
    
    return await fetchLegalTextsFromHF(domain, "statutes");
    
  } catch (error) {
    console.error("Error fetching legal statutes from Hugging Face:", error);
    return getFallbackStatutes(domain);
  }
}

/**
 * Fetch legal principles from Hugging Face legal text datasets
 */
export async function fetchLegalPrinciplesFromHF(domain: string): Promise<string[]> {
  try {
    console.log(`Fetching legal principles for domain: ${domain}`);
    
    const datasets = [
      "pile-of-law/pile-of-law",
      "legal-eagle/legal-principles",
      "lexlms/legal-concepts"
    ];
    
    for (const dataset of datasets) {
      try {
        const response = await fetch(`https://datasets-server.huggingface.co/rows?dataset=${dataset}&config=default&split=train&offset=0&length=10`, {
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return processPrinciplesData(data.rows || [], domain);
        }
      } catch (error) {
        console.log(`Failed to fetch principles from ${dataset}:`, error.message);
        continue;
      }
    }
    
    return getFallbackPrinciples(domain);
    
  } catch (error) {
    console.error("Error fetching legal principles from Hugging Face:", error);
    return getFallbackPrinciples(domain);
  }
}

/**
 * Generic legal text fetcher for when specific datasets are unavailable
 */
async function fetchLegalTextsFromHF(domain: string, type: "cases" | "statutes"): Promise<LegalCase[] | LegalStatute[]> {
  try {
    // Use general legal text datasets
    const response = await fetch(`https://datasets-server.huggingface.co/rows?dataset=pile-of-law/pile-of-law&config=default&split=train&offset=0&length=25`, {
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Successfully fetched general legal texts for ${type}`);
      
      if (type === "cases") {
        return processCasesData(data.rows || [], domain);
      } else {
        return processStatutesData(data.rows || [], domain);
      }
    }
    
    throw new Error("Failed to fetch general legal texts");
    
  } catch (error) {
    console.error(`Error fetching legal texts from HF:`, error);
    return type === "cases" ? getFallbackCases(domain) : getFallbackStatutes(domain);
  }
}

/**
 * Process raw dataset rows into legal cases
 */
function processCasesData(rows: any[], domain: string): LegalCase[] {
  return rows.slice(0, 6).map((row, index) => {
    const text = row.row?.text || row.row?.content || row.row?.document || "";
    const title = extractTitle(text) || `${domain} Case ${index + 1}`;
    const citation = extractCitation(text) || `Case-${Date.now()}-${index}`;
    
    return {
      id: `hf-case-${domain}-${index}`,
      title: title.substring(0, 100),
      citation,
      description: extractDescription(text, 200),
      domain,
      jurisdiction: "general"
    };
  });
}

/**
 * Process raw dataset rows into legal statutes
 */
function processStatutesData(rows: any[], domain: string): LegalStatute[] {
  return rows.slice(0, 4).map((row, index) => {
    const text = row.row?.text || row.row?.content || row.row?.document || "";
    const title = extractTitle(text) || `${domain} Statute ${index + 1}`;
    const citation = extractCitation(text) || `Stat-${Date.now()}-${index}`;
    
    return {
      id: `hf-statute-${domain}-${index}`,
      title: title.substring(0, 100),
      citation,
      description: extractDescription(text, 150),
      domain,
      jurisdiction: "general"
    };
  });
}

/**
 * Process raw dataset rows into legal principles
 */
function processPrinciplesData(rows: any[], domain: string): string[] {
  const principles: string[] = [];
  
  rows.slice(0, 5).forEach((row, index) => {
    const text = row.row?.text || row.row?.content || row.row?.document || "";
    const principle = extractPrinciple(text, domain);
    if (principle) {
      principles.push(principle);
    }
  });
  
  // Ensure we have at least some principles
  if (principles.length === 0) {
    return getFallbackPrinciples(domain);
  }
  
  return principles;
}

/**
 * Extract title from legal text
 */
function extractTitle(text: string): string {
  // Look for case names, statute titles, etc.
  const patterns = [
    /^([A-Z][a-z]+ v\. [A-Z][a-z]+)/,
    /^([A-Z][^.]{10,80})/,
    /Title: ([^.\n]{10,80})/i,
    /^(\d+\.\s*[A-Z][^.\n]{10,80})/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  // Fallback: use first meaningful line
  const lines = text.split('\n').filter(line => line.trim().length > 10);
  return lines[0]?.substring(0, 80) || "Legal Document";
}

/**
 * Extract citation from legal text
 */
function extractCitation(text: string): string {
  const patterns = [
    /\b\d+\s+[A-Z][a-z.]+\s+\d+/,
    /\[\d{4}\]\s+[A-Z]+\s+\d+/,
    /\d+\s+U\.S\.\s+\d+/,
    /\b\d+\s+F\.\d*d?\s+\d+/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return `Ref-${Date.now()}`;
}

/**
 * Extract description from legal text
 */
function extractDescription(text: string, maxLength: number): string {
  // Clean the text
  let description = text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Find the most relevant sentence
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (sentences.length > 0) {
    description = sentences[0].trim();
  }
  
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + "...";
  }
  
  return description || "Legal analysis and precedent information.";
}

/**
 * Extract legal principle from text
 */
function extractPrinciple(text: string, domain: string): string | null {
  const principlePatterns = [
    /The court held that ([^.]{20,100})/i,
    /It is established that ([^.]{20,100})/i,
    /The principle states ([^.]{20,100})/i,
    /([A-Z][^.]{15,80} is required for [^.]{10,50})/,
    /([A-Z][^.]{15,80} must [^.]{10,50})/
  ];
  
  for (const pattern of principlePatterns) {
    const match = text.match(pattern);
    if (match) {
      let principle = match[1].trim();
      if (principle.length > 20 && principle.length < 120) {
        return principle.charAt(0).toUpperCase() + principle.slice(1);
      }
    }
  }
  
  return null;
}

/**
 * Fallback cases when Hugging Face is unavailable
 */
function getFallbackCases(domain: string): LegalCase[] {
  const fallbacks = {
    contract: [
      {
        id: "fallback-contract-1",
        title: "Hadley v. Baxendale",
        citation: "9 Exch. 341 (1854)",
        description: "Established the foreseeability rule for contract damages in breach of contract cases.",
        domain: "contract"
      }
    ],
    property: [
      {
        id: "fallback-property-1", 
        title: "Pierson v. Post",
        citation: "3 Cai. R. 175 (1805)",
        description: "Established principles of property acquisition through pursuit of wild animals.",
        domain: "property"
      }
    ],
    tort: [
      {
        id: "fallback-tort-1",
        title: "Palsgraf v. Long Island Railroad Co.",
        citation: "248 N.Y. 339 (1928)",
        description: "Established limits of liability based on foreseeability of harm.",
        domain: "tort"
      }
    ],
    constitutional: [
      {
        id: "fallback-constitutional-1",
        title: "Marbury v. Madison",
        citation: "5 U.S. 137 (1803)",
        description: "Established judicial review and the Supreme Court's power to invalidate laws.",
        domain: "constitutional"
      }
    ],
    criminal: [
      {
        id: "fallback-criminal-1",
        title: "Miranda v. Arizona",
        citation: "384 U.S. 436 (1966)",
        description: "Established requirement for police to inform arrestees of their rights.",
        domain: "criminal"
      }
    ],
    zambian: [
      {
        id: "fallback-zambian-1",
        title: "Attorney General v. Nigel Mutuna & Others",
        citation: "2012/SCZ/26",
        description: "Established judicial independence principles in Zambian law.",
        domain: "zambian"
      }
    ],
    cyberSecurity: [
      {
        id: "fallback-cybersecurity-1",
        title: "United States v. Jones",
        citation: "565 U.S. 400 (2012)",
        description: "GPS tracking and digital surveillance evidence standards.",
        domain: "cyberSecurity"
      }
    ]
  };
  
  return fallbacks[domain as keyof typeof fallbacks] || [];
}

/**
 * Fallback statutes when Hugging Face is unavailable
 */
function getFallbackStatutes(domain: string): LegalStatute[] {
  const fallbacks = {
    contract: [
      {
        id: "fallback-statute-contract-1",
        title: "Uniform Commercial Code",
        citation: "U.C.C.",
        description: "Governs sales of goods and commercial transactions.",
        domain: "contract"
      }
    ],
    property: [
      {
        id: "fallback-statute-property-1",
        title: "Statute of Frauds", 
        citation: "29 Car. II c. 3",
        description: "Requires certain contracts to be in writing, including land contracts.",
        domain: "property"
      }
    ],
    tort: [
      {
        id: "fallback-statute-tort-1",
        title: "Federal Tort Claims Act",
        citation: "28 U.S.C. §§ 1346(b), 2671-2680",
        description: "Allows tort suits against the United States government.",
        domain: "tort"
      }
    ],
    constitutional: [
      {
        id: "fallback-statute-constitutional-1",
        title: "Civil Rights Act of 1964",
        citation: "42 U.S.C. § 2000e et seq.",
        description: "Prohibits discrimination based on race, color, religion, sex, or national origin.",
        domain: "constitutional"
      }
    ],
    criminal: [
      {
        id: "fallback-statute-criminal-1",
        title: "Model Penal Code",
        citation: "MPC",
        description: "Influential model criminal code developed by legal scholars.",
        domain: "criminal"
      }
    ],
    zambian: [
      {
        id: "fallback-statute-zambian-1",
        title: "Constitution of Zambia (Amendment) Act, No. 2 of 2016",
        citation: "Act No. 2 of 2016",
        description: "The Constitution of Zambia, as amended in 2016.",
        domain: "zambian"
      }
    ],
    cyberSecurity: [
      {
        id: "fallback-statute-cybersecurity-1",
        title: "Computer Fraud and Abuse Act",
        citation: "18 U.S.C. § 1030",
        description: "Federal law prohibiting unauthorized access to computers.",
        domain: "cyberSecurity"
      }
    ]
  };
  
  return fallbacks[domain as keyof typeof fallbacks] || [];
}

/**
 * Fallback principles when Hugging Face is unavailable
 */
function getFallbackPrinciples(domain: string): string[] {
  const fallbacks = {
    contract: ["Mutual assent required for contract formation", "Consideration necessary for enforceable agreements"],
    property: ["First in time, first in right", "Possession as notice to the world"],
    tort: ["Duty of reasonable care owed to foreseeable plaintiffs", "Causation requires both factual and proximate cause"],
    constitutional: ["Separation of powers divides authority between branches", "Equal protection requires similar treatment"],
    criminal: ["Beyond reasonable doubt standard of proof", "Presumption of innocence"],
    zambian: ["English common law applies except where modified by statute", "Constitutional supremacy"],
    cyberSecurity: ["Digital evidence must be authenticated", "Chain of custody must be maintained"]
  };
  
  return fallbacks[domain as keyof typeof fallbacks] || ["Consult with qualified legal professional for specific advice"];
}
