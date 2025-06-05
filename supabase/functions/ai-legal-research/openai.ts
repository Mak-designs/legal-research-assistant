
// Hugging Face integration module for legal research

const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

/**
 * Generate AI-powered legal response using Hugging Face
 * @param query The user's legal query
 * @param primaryDomain Primary legal domain for the query
 * @param secondaryDomain Secondary legal domain for the query
 * @param systemPrompt The system prompt for the model
 * @param jurisdiction The jurisdiction context (e.g., "zambian", "general")
 * @returns Legal analysis and recommendation
 */
export async function generateAILegalResponse(query: string, primaryDomain: string, secondaryDomain: string, systemPrompt: string, jurisdiction: string) {
  if (!huggingFaceToken) {
    console.error("Missing Hugging Face access token");
    return {
      recommendation: "Unable to generate AI recommendation. Please check that the Hugging Face access token is configured.",
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "missing_api_key"
    };
  }

  try {
    console.log("Generating AI response for query:", query.substring(0, 50) + "...");

    // Build the prompt by combining the system prompt and user query
    const fullPrompt = `${systemPrompt}\n\nAnalyze this legal query: "${query}"\n\nPlease format your response as a JSON object with the following fields: "recommendation", "primaryAnalysis", "secondaryAnalysis", and "technicalDetails".`;
    
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${huggingFaceToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true
        }
      })
    });

    const data = await response.json();
    console.log("Hugging Face response status:", response.status);

    if (!response.ok) {
      console.error("Hugging Face API error:", data);

      // Handle rate limiting
      if (response.status === 429 || data.error?.includes("rate limit")) {
        return {
          recommendation: "The AI legal analysis service is currently unavailable due to rate limiting. Please try again later.",
          primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
          secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
          error: "rate_limit_exceeded"
        };
      }

      throw new Error(`Hugging Face API error: ${data.error || "Unknown error"}`);
    }

    // Parse the response from Hugging Face
    try {
      let responseText = "";
      
      // Handle different response formats from Hugging Face
      if (Array.isArray(data) && data.length > 0) {
        responseText = data[0].generated_text || data[0].text || "";
      } else if (data.generated_text) {
        responseText = data.generated_text;
      } else if (typeof data === 'string') {
        responseText = data;
      }
      
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const parsedResponse = JSON.parse(jsonString);

        return {
          recommendation: parsedResponse.recommendation || "Analysis completed successfully.",
          primaryAnalysis: parsedResponse.primaryAnalysis || generateFallbackAnalysis(primaryDomain, query),
          secondaryAnalysis: parsedResponse.secondaryAnalysis || generateFallbackAnalysis(secondaryDomain, query),
          technicalDetails: parsedResponse.technicalDetails
        };
      } else {
        // Fallback to using the raw text if no JSON found
        return {
          recommendation: responseText.substring(0, 500) || "Analysis completed successfully.",
          primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
          secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
          error: "parse_error"
        };
      }
    } catch (parseError) {
      console.error("Failed to parse Hugging Face response:", parseError);
      
      // Get the raw text from the response
      let responseText = "";
      if (Array.isArray(data) && data.length > 0) {
        responseText = data[0].generated_text || data[0].text || "No response generated";
      } else {
        responseText = "No response generated";
      }
      
      return {
        recommendation: responseText.substring(0, 500),
        primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
        secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
        error: "parse_error"
      };
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return {
      recommendation: "An error occurred while generating the legal analysis. Please try again.",
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "api_error"
    };
  }
}

/**
 * Generate fallback analysis when Hugging Face API is unavailable
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
