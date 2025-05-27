// Gemini integration module for legal research

/* const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

/**
 * Generate AI-powered legal response using Google's Gemini
 * @param query The user's legal query
 * @param primaryDomain Primary legal domain for the query
 * @param secondaryDomain Secondary legal domain for the query
 * @param systemPrompt The system prompt for the Gemini model
 * @param jurisdiction The jurisdiction context (e.g., "zambian", "general")
 * @returns Legal analysis and recommendation
 */
/*export async function generateAILegalResponse(query: string, primaryDomain: string, secondaryDomain: string, systemPrompt: string, jurisdiction: string) {
  if (!geminiApiKey) {
    console.error("Missing Gemini API key");
    return {

      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "missing_api_key"
    };
  }

  try {
    console.log("Generating AI response for query:", query.substring(0, 50) + "...");
    
    // Gemini API endpoint
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    // Construct the full URL with API key
    const url = `${apiUrl}?key=${geminiApiKey}`;
    
    // Build the prompt by combining the system prompt and user query
    const fullPrompt = `${systemPrompt}\n\nAnalyze this legal query: "${query}"\n\nPlease format your response as a JSON object with the following fields: "recommendation", "primaryAnalysis", "secondaryAnalysis", and "technicalDetails".`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: fullPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          topP: 0.95,
          topK: 40
        }
      })
    });

    const data = await response.json();
    console.log("AI response status:", response.status);
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      
      // Handle quota exceeded error specifically
      if (response.status === 429 || data.error?.code === 429) {
        return {
        
          primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
          secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
          error: "quota_exceeded"
        };
      }
      
      throw new Error(data.error?.message || "Failed to generate AI response");
    }

    // Parse the JSON from the AI response
    try {
      // Extract text content from Gemini response structure
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
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
      
      // Get the raw text from the Gemini response
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
      
      // Fallback to directly using the text
      return {
        recommendation: responseText.substring(0, 500),
        primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
        secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
        error: "parse_error"
      };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {

      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "api_error"
    };
  }
}

/**
 * Generate fallback analysis when Gemini API is unavailable
 * @param domain The legal domain
 * @param query The user's query
 * @returns A basic domain-specific analysis
 */
/*function generateFallbackAnalysis(domain: string, query: string): string {
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
  

}
