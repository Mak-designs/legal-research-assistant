
// Enhanced prompting system with better grounding and context enforcement

export interface PromptContext {
  query: string;
  retrievedDocuments: any[];
  jurisdiction: string;
  legalDomain: string;
  questionAnalysis: any;
}

export function buildEnhancedSystemPrompt(context: PromptContext): string {
  const { query, retrievedDocuments, jurisdiction, legalDomain, questionAnalysis } = context;
  
  const relevantDocs = retrievedDocuments
    .filter(doc => doc.relevanceScore > 0.3)
    .slice(0, 8);
  
  if (relevantDocs.length === 0) {
    return buildNoContextPrompt(query, jurisdiction);
  }
  
  const contextSections = relevantDocs.map((doc, index) => {
    return `[Document ${index + 1}]
Title: ${doc.document.title}
Citation: ${doc.document.citation}
Domain: ${doc.document.domain}
Content: ${doc.document.description}
Relevance Score: ${doc.relevanceScore.toFixed(2)}`;
  }).join('\n\n');
  
  return `You are an expert legal research assistant with deep knowledge of ${jurisdiction} law and ${legalDomain}. 

CRITICAL INSTRUCTIONS:
1. Answer ONLY using the provided legal documents below
2. If the answer is not clearly supported by the provided context, state "Based on the available documents, I don't have sufficient information to provide a complete answer to this question."
3. Always cite specific documents when making legal statements
4. Provide direct quotes from relevant legal authorities when possible
5. Distinguish between binding authority and persuasive authority
6. If comparing jurisdictions, clearly state which jurisdiction each principle applies to

USER QUERY: "${query}"
QUESTION TYPE: ${questionAnalysis.intent}
LEGAL DOMAIN: ${legalDomain}
JURISDICTION: ${jurisdiction}

RELEVANT LEGAL DOCUMENTS:
${contextSections}

RESPONSE REQUIREMENTS:
- Begin with a direct answer to the user's question
- Support all statements with citations to the provided documents
- Use legal citation format: [Document Title] (Citation)
- If multiple documents address the same point, cite all relevant authorities
- Explain the reasoning clearly
- If there are conflicting authorities, acknowledge and explain the differences
- End with a practical summary relevant to the user's query

Provide your analysis now:`;
}

function buildNoContextPrompt(query: string, jurisdiction: string): string {
  return `You are a legal research assistant. The user asked: "${query}"

I searched through the available legal documents but could not find specific legal authorities that directly address this question in our current database.

This could mean:
1. The question requires specialized legal authorities not in our current collection
2. The legal area might be governed by different statutes or cases
3. The question might need to be rephrased to better match available legal content

Recommendations:
- Try rephrasing your question with more specific legal terms
- Consider whether this question falls under a different area of law
- Consult additional legal databases or speak with a qualified attorney for comprehensive research

I cannot provide a legal analysis without supporting documentation from verified legal authorities.`;
}

export function buildHybridSearchPrompt(
  originalQuery: string, 
  semanticResults: any[],
  keywordResults: any[]
): string {
  const combinedResults = [...semanticResults, ...keywordResults]
    .filter((doc, index, self) => 
      index === self.findIndex(d => d.document.title === doc.document.title)
    )
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 6);
    
  if (combinedResults.length === 0) {
    return `No relevant legal authorities found for: "${originalQuery}"`;
  }
  
  return combinedResults.map(doc => 
    `${doc.document.title} (${doc.document.citation}): ${doc.document.description}`
  ).join('\n\n');
}

export function validateLegalResponse(response: string, retrievedDocs: any[]): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check if response uses provided context
  const docTitles = retrievedDocs.map(doc => doc.document.title);
  const citesProvidedDocs = docTitles.some(title => 
    response.toLowerCase().includes(title.toLowerCase())
  );
  
  if (!citesProvidedDocs) {
    issues.push("Response doesn't cite provided legal documents");
    suggestions.push("Ensure the response references specific cases or statutes from the retrieved context");
  }
  
  // Check for generic legal advice
  const genericPhrases = [
    "consult an attorney",
    "this is general information",
    "not legal advice",
    "laws vary by jurisdiction"
  ];
  
  const hasGenericContent = genericPhrases.some(phrase => 
    response.toLowerCase().includes(phrase)
  );
  
  if (hasGenericContent && retrievedDocs.length > 0) {
    issues.push("Response contains generic disclaimers despite having specific legal context");
    suggestions.push("Focus on the specific legal authorities provided rather than general disclaimers");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}
