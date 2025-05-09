
// OpenAI integration module for legal research

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

/**
 * Generate AI-powered legal response using OpenAI
 * @param query The user's legal query
 * @param primaryDomain Primary legal domain for the query
 * @param secondaryDomain Secondary legal domain for the query
 * @param systemPrompt The system prompt for the OpenAI model
 * @param jurisdiction The jurisdiction context (e.g., "zambian", "general")
 * @returns Legal analysis and recommendation
 */
export async function generateAILegalResponse(query: string, primaryDomain: string, secondaryDomain: string, systemPrompt: string, jurisdiction: string) {
  if (!openaiApiKey) {
    console.error("Missing OpenAI API key");
    return {
      recommendation: "Unable to generate AI recommendation. Please check that the OpenAI API key is configured.",
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "missing_api_key"
    };
  }

  try {
    console.log("Generating AI response for query:", query.substring(0, 50) + "...");
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using the more affordable model to avoid quota issues
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this legal query: "${query}"` }
        ],
        temperature: 0.7, // Slightly higher temperature for more conversational tone
        max_tokens: 2000
      })
    });

    const data = await response.json();
    console.log("AI response status:", response.status);
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      
      // Handle quota exceeded error specifically
      if (response.status === 429 || (data.error?.type === "insufficient_quota")) {
        return {
          recommendation: "The AI legal analysis service is currently unavailable due to API quota limitations. Please try again later or contact support to upgrade the API plan.",
          primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
          secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
          error: "quota_exceeded"
        };
      }
      
      throw new Error(data.error?.message || "Failed to generate AI response");
    }

    // Parse the JSON from the AI response
    try {
      const responseText = data.choices[0].message.content;
      // Extract the JSON object from the response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsedResponse = JSON.parse(jsonString);
      
      console.log("Successfully parsed AI response");
      
      return {
        recommendation: parsedResponse.recommendation || "Analysis not available based on provided information.",
        primaryAnalysis: parsedResponse.primaryAnalysis || generateFallbackAnalysis(primaryDomain, query),
        secondaryAnalysis: parsedResponse.secondaryAnalysis || generateFallbackAnalysis(secondaryDomain, query),
        technicalDetails: parsedResponse.technicalDetails
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to directly using the text
      return {
        recommendation: data.choices[0].message.content.substring(0, 500),
        primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
        secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
        error: "parse_error"
      };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      recommendation: "Error generating legal analysis. Our AI service is currently experiencing technical difficulties. Please try again later or use the standard analysis mode.",
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "api_error"
    };
  }
}

/**
 * Generate fallback analysis when OpenAI API is unavailable
 * @param domain The legal domain
 * @param query The user's query
 * @returns A basic domain-specific analysis
 */
function generateFallbackAnalysis(domain: string, query: string): string {
  const domainCapitalized = domain.charAt(0).toUpperCase() + domain.slice(1);
  
  const domainSpecificContent = {
    property: `Property law concerns the various forms of ownership and tenancy in real property and personal property. Key concepts include ownership, possession, and various interests in property. When analyzing property issues, courts typically consider factors such as rightful title, adverse possession, easements, and covenants.`,
    
    contract: `Contract law governs agreements between parties and provides remedies when a contract is breached. For a contract to be valid, there must be offer, acceptance, consideration, intention to create legal relations, and certainty of terms. Courts interpret contracts by looking at the plain meaning of the terms and the parties' intentions.`,
    
    tort: `Tort law addresses civil wrongs that cause someone to suffer loss or harm, resulting in legal liability for the person who commits the act. Key tort concepts include negligence, intentional torts, and strict liability. Courts assess factors such as duty of care, breach, causation, and damages.`,
    
    constitutional: `Constitutional law is the body of law derived from a country's constitution. It establishes the framework of government, defines the scope of governmental powers, and guarantees individual civil rights and liberties. Courts interpret constitutional provisions by examining the text, original intent, precedent, and practical consequences.`,
    
    criminal: `Criminal law concerns offenses committed against the public, society, or the state. It defines conduct that is prohibited and prescribes punishments for violations. Courts analyze criminal cases by examining elements of crimes, defenses, procedural requirements, and standards of proof.`,
    
    zambian: `Zambian law combines elements of common law, customary law, and statutory law. The Constitution of Zambia is the supreme law, and courts interpret laws with consideration for local customs and international obligations. Recent developments include cybersecurity regulations and digital evidence standards.`,
    
    cyberSecurity: `Cyber security law addresses legal issues related to digital information, computer systems, and networks. It covers areas such as data protection, electronic evidence, cybercrime, and digital transactions. Courts consider technical aspects of digital evidence including integrity verification and chain of custody.`
  };
  
  // Default text if domain not found in our mapping
  const defaultText = `${domainCapitalized} law analysis is currently unavailable through our AI system. Please refer to the relevant cases and statutes listed below for guidance on your query regarding "${query}".`;
  
  // Get the domain-specific content or use default
  const domainText = domainSpecificContent[domain as keyof typeof domainSpecificContent] || defaultText;
  
  return `${domainText}\n\nNote: This is a standard analysis as our AI-powered detailed analysis is currently unavailable. Please refer to the case examples and statutes below for specific legal precedents related to your query.`;
}
