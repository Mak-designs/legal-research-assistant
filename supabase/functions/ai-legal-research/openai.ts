
// Gemini integration module for legal research

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

/**
 * Generate AI-powered legal response using Google's Gemini
 * @param query The user's legal query
 * @param primaryDomain Primary legal domain for the query
 * @param secondaryDomain Secondary legal domain for the query
 * @param systemPrompt The system prompt for the Gemini model
 * @param jurisdiction The jurisdiction context (e.g., "zambian", "general")
 * @returns Legal analysis and recommendation
 */
export async function generateAILegalResponse(query: string, primaryDomain: string, secondaryDomain: string, systemPrompt: string, jurisdiction: string) {
  if (!geminiApiKey) {
    console.error("Missing Gemini API key");
    return {
      recommendation: "Unable to generate AI recommendation. Please check that the Gemini API key is configured.",
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
          recommendation: "The AI legal analysis service is currently unavailable due to API quota limitations. Please try again later or contact support to upgrade the API plan.",
          primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
          secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
          error: "quota_exceeded"
        };
      }

      throw new Error(`Gemini API error: ${data.error?.message || "Unknown error"}`);
    }

    // Parse the JSON from the AI response
    try {
      // Extract text content from Gemini response structure
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Extract the JSON object from the response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsedResponse = JSON.parse(jsonString);

      return {
        recommendation: parsedResponse.recommendation || "Analysis completed successfully.",
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
    console.error("Error calling Gemini API:", error);
    return {
      recommendation: "An error occurred while generating the legal analysis. Please try again.",
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
function generateFallbackAnalysis(domain: string, query: string): string {
  const fallbackAnalyses: Record<string, string> = {
    contract: "Contract law governs agreements between parties and provides remedies when a contract is breached. For a contract to be valid, there must be offer, acceptance, consideration, intention to create legal relations, and certainty of terms. Courts interpret contracts by looking at the plain meaning of the terms and the parties' intentions.",
    
    property: "Property law concerns the various forms of ownership and tenancy in real property and personal property. Key concepts include ownership, possession, and various interests in property. When analyzing property issues, courts typically consider factors such as rightful title, adverse possession, easements, and covenants.",
    
    tort: "Tort law provides remedies for civil wrongs that cause harm to individuals or property. The fundamental principle is that those who cause harm through negligent or intentional conduct should compensate the injured party. Courts examine duty of care, breach, causation, and damages.",
    
    constitutional: "Constitutional law involves the interpretation and application of a country's constitution. It establishes the framework of government, defines the relationship between different branches of government, and protects fundamental rights and freedoms of citizens.",
    
    criminal: "Criminal law defines conduct that is prohibited by the state and establishes penalties for violations. The prosecution must prove guilt beyond a reasonable doubt. Key principles include the presumption of innocence, burden of proof, and various defenses available to the accused.",
    
    zambian: "Zambian law is based on English common law with statutory modifications and customary law influences. The legal system recognizes both received English law and local customary practices, particularly in matters of personal status and land tenure.",
    
    cyberSecurity: "Cyber security law addresses legal issues related to digital technologies, data protection, and online activities. This includes privacy regulations, data breach notification requirements, cybercrime prosecution, and digital evidence handling procedures."
  };

  return fallbackAnalyses[domain] || "Legal analysis involves examining relevant statutes, case law, and legal principles to provide guidance on the specific legal issues presented in the query.";
}
