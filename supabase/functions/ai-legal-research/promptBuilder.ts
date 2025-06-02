// Prompt building utilities for legal research

/**
 * Build system prompt for AI legal analysis
 * @param query The user's legal query
 * @param primaryDomain Primary legal domain for the query
 * @param secondaryDomain Secondary legal domain for the query
 * @param jurisdiction The jurisdiction context (e.g., "zambian", "general")
 * @returns Formatted system prompt for OpenAI
 */
export function buildSystemPrompt(query: string, primaryDomain: string, secondaryDomain: string, jurisdiction: string): string {
  const basePrompt = `You are an expert legal research assistant specializing in ${jurisdiction === "zambian" ? "Zambian" : "comparative"} law analysis.`;
  
  const domainContext = getDomainContext(primaryDomain, secondaryDomain);
  const jurisdictionContext = getJurisdictionContext(jurisdiction);
  const queryContext = getQuerySpecificContext(query);
  
  const instructions = `
ANALYSIS REQUIREMENTS:
1. **Recommendation**: Provide specific, actionable legal guidance
2. **Primary Analysis**: Deep dive into ${primaryDomain} law aspects
3. **Secondary Analysis**: Examine ${secondaryDomain} law implications
4. **Technical Details**: Include procedural or technical requirements if applicable

RESPONSE FORMATTING:
- Use clear, professional legal language
- Cite specific legal authorities where applicable
- Provide practical guidance alongside theoretical analysis
- Structure information logically and accessibly

${domainContext}
${jurisdictionContext}
${queryContext}

Respond in JSON format with the exact fields: "recommendation", "primaryAnalysis", "secondaryAnalysis", and "technicalDetails".
`;

  return basePrompt + instructions;
}

/**
 * Get domain-specific context and expertise
 */
function getDomainContext(primaryDomain: string, secondaryDomain: string): string {
  const domainExpertise: Record<string, string> = {
    contract: "Focus on offer, acceptance, consideration, capacity, and legality. Consider breach remedies and contract interpretation principles.",
    property: "Analyze ownership, possession, transfer mechanisms, and property rights. Consider both real and personal property implications.",
    tort: "Examine duty of care, breach, causation, and damages. Consider both intentional and negligent torts.",
    constitutional: "Focus on fundamental rights, governmental powers, and constitutional interpretation principles.",
    criminal: "Analyze elements of crimes, defenses, and procedural safeguards. Consider burden of proof and evidence standards.",
    zambian: "Apply Zambian statutory law, case precedents, and customary law principles. Consider local court hierarchy and practice.",
    cyberSecurity: "Focus on digital evidence standards, cybercrime laws, and technology-related legal frameworks."
  };

  return `
DOMAIN EXPERTISE:
Primary Domain (${primaryDomain}): ${domainExpertise[primaryDomain] || "Apply general legal principles with domain-specific focus."}
Secondary Domain (${secondaryDomain}): ${domainExpertise[secondaryDomain] || "Consider supplementary legal frameworks."}
`;
}

/**
 * Get jurisdiction-specific guidance
 */
function getJurisdictionContext(jurisdiction: string): string {
  if (jurisdiction === "zambian") {
    return `
ZAMBIAN LAW CONTEXT:
- Apply the Constitution of Zambia (2016) as supreme law
- Reference relevant Acts of Parliament and statutory instruments
- Consider High Court and Supreme Court precedents
- Include customary law where applicable
- Reference the Cyber Security and Cyber Crimes Act No. 2 of 2021 for technology-related matters
- Apply English common law as received law where Zambian law is silent
`;
  }
  
  return `
GENERAL LAW CONTEXT:
- Draw from common law principles and comparative jurisprudence
- Reference widely accepted legal doctrines and precedents
- Consider international best practices where relevant
- Provide balanced analysis across different legal systems
`;
}

/**
 * Generate query-specific analytical guidance
 */
function getQuerySpecificContext(query: string): string {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes("evidence") || queryLower.includes("proof")) {
    return `
EVIDENCE FOCUS:
- Address admissibility standards and evidentiary rules
- Consider burden of proof and standard of evidence
- Include procedural requirements for evidence presentation
`;
  }
  
  if (queryLower.includes("procedure") || queryLower.includes("process")) {
    return `
PROCEDURAL FOCUS:
- Outline step-by-step procedural requirements
- Include timing and deadlines where relevant
- Address jurisdictional and venue considerations
`;
  }
  
  if (queryLower.includes("digital") || queryLower.includes("cyber") || queryLower.includes("electronic")) {
    return `
DIGITAL LAW FOCUS:
- Address technology-specific legal frameworks
- Include digital evidence authentication requirements
- Consider cybersecurity and data protection implications
`;
  }
  
  if (queryLower.includes("contract") || queryLower.includes("agreement")) {
    return `
CONTRACT LAW FOCUS:
- Analyze formation, performance, and breach issues
- Consider remedies and damages calculations
- Include interpretation and enforcement mechanisms
`;
  }
  
  return `
GENERAL ANALYSIS:
- Provide comprehensive legal analysis addressing all relevant aspects
- Consider both theoretical principles and practical applications
- Include potential risks and mitigation strategies
`;
}
