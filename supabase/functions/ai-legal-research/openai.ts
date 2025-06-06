
// Hugging Face integration module for legal research

const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

/**
 * Validate Hugging Face token format and existence
 */
function validateHuggingFaceToken(): { isValid: boolean; error?: string } {
  if (!huggingFaceToken) {
    return { isValid: false, error: "HUGGING_FACE_ACCESS_TOKEN environment variable not found" };
  }
  
  if (typeof huggingFaceToken !== 'string' || huggingFaceToken.trim().length === 0) {
    return { isValid: false, error: "Token is empty or invalid type" };
  }
  
  // Check if token starts with 'hf_' which is the standard format
  if (!huggingFaceToken.startsWith('hf_')) {
    return { isValid: false, error: "Token should start with 'hf_' - invalid format" };
  }
  
  // Check minimum length (Hugging Face tokens are typically longer)
  if (huggingFaceToken.length < 20) {
    return { isValid: false, error: "Token appears to be too short" };
  }
  
  return { isValid: true };
}

/**
 * Test Hugging Face API connectivity
 */
async function testHuggingFaceConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${huggingFaceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "test",
        parameters: { max_new_tokens: 5 }
      })
    });

    if (response.status === 401) {
      return { success: false, error: "Authentication failed - token is invalid or expired" };
    }
    
    if (response.status === 403) {
      return { success: false, error: "Access forbidden - check token permissions" };
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API test failed: ${response.status} - ${errorText}` };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: `Connection test failed: ${error.message}` };
  }
}

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
  // Step 1: Validate token
  const tokenValidation = validateHuggingFaceToken();
  if (!tokenValidation.isValid) {
    console.error("Token validation failed:", tokenValidation.error);
    return {
      recommendation: "AI analysis is currently unavailable due to API configuration issues. Please verify the Hugging Face access token is properly set.",
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "invalid_token"
    };
  }

  console.log("Token validation passed. Testing API connection...");
  
  // Step 2: Test API connectivity
  const connectionTest = await testHuggingFaceConnection();
  if (!connectionTest.success) {
    console.error("API connection test failed:", connectionTest.error);
    return {
      recommendation: `AI analysis is currently unavailable: ${connectionTest.error}`,
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "connection_failed"
    };
  }

  console.log("API connection test successful. Generating legal analysis...");

  try {
    // Build a more specific prompt for legal analysis
    const legalPrompt = `You are a legal research assistant. Analyze this query and provide detailed legal insights.

Query: "${query}"
Primary Legal Domain: ${primaryDomain}
Secondary Legal Domain: ${secondaryDomain}
Jurisdiction: ${jurisdiction}

Please provide:
1. A comprehensive analysis from the ${primaryDomain} perspective
2. A secondary analysis from the ${secondaryDomain} perspective  
3. A practical recommendation based on both analyses

Format your response as structured legal analysis:`;

    // Try multiple models in order of preference
    const models = [
      "microsoft/DialoGPT-large",
      "microsoft/DialoGPT-medium", 
      "gpt2"
    ];

    let lastError = null;
    
    for (const model of models) {
      try {
        console.log(`Attempting to use model: ${model}`);
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${huggingFaceToken}`,
            "Content-Type": "application/json",
            "User-Agent": "Supabase-Edge-Function/1.0"
          },
          body: JSON.stringify({
            inputs: legalPrompt,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false,
              pad_token_id: 50256
            },
            options: {
              wait_for_model: true,
              use_cache: false
            }
          })
        });

        console.log(`Model ${model} response status:`, response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Model ${model} error:`, errorText);
          lastError = `${model}: ${response.status} - ${errorText}`;
          continue; // Try next model
        }

        const data = await response.json();
        console.log(`Model ${model} response received:`, JSON.stringify(data).substring(0, 100) + "...");

        // Parse the response
        let responseText = "";
        if (Array.isArray(data) && data.length > 0) {
          responseText = data[0].generated_text || data[0].text || "";
        } else if (data.generated_text) {
          responseText = data.generated_text;
        } else if (typeof data === 'string') {
          responseText = data;
        }

        if (responseText && responseText.length > 10) {
          // Parse the structured response or create structured output
          const sections = responseText.split(/\d+\.|Primary|Secondary|Recommendation/i);
          
          return {
            recommendation: extractRecommendation(responseText, query),
            primaryAnalysis: extractPrimaryAnalysis(responseText, primaryDomain) || generateEnhancedFallbackAnalysis(primaryDomain, query, responseText),
            secondaryAnalysis: extractSecondaryAnalysis(responseText, secondaryDomain) || generateEnhancedFallbackAnalysis(secondaryDomain, query, responseText),
            technicalDetails: extractTechnicalDetails(query, responseText)
          };
        }
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError);
        lastError = `${model}: ${modelError.message}`;
        continue;
      }
    }

    // If all models failed
    throw new Error(`All models failed. Last error: ${lastError}`);

  } catch (error) {
    console.error("Error in AI generation:", error);
    return {
      recommendation: "AI analysis encountered an error during processing. Please try again later.",
      primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
      secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
      error: "processing_error"
    };
  }
}

/**
 * Extract recommendation from AI response
 */
function extractRecommendation(text: string, query: string): string {
  const recommendationMatch = text.match(/recommendation[:\s]*([^.]*(?:\.[^.]*){0,3})/i);
  if (recommendationMatch) {
    return recommendationMatch[1].trim();
  }
  
  // Fallback: use last paragraph or generate based on query
  const paragraphs = text.split('\n').filter(p => p.trim().length > 20);
  if (paragraphs.length > 0) {
    return paragraphs[paragraphs.length - 1].trim();
  }
  
  return `Based on the analysis of "${query}", please consult with a qualified legal professional for specific advice tailored to your situation.`;
}

/**
 * Extract primary analysis section
 */
function extractPrimaryAnalysis(text: string, domain: string): string {
  const patterns = [
    new RegExp(`${domain}[^:]*:([^]*?)(?:secondary|recommendation|\\n\\n)`, 'i'),
    new RegExp(`primary[^:]*:([^]*?)(?:secondary|recommendation|\\n\\n)`, 'i'),
    new RegExp(`1\\.[^]*?([^]*?)(?:2\\.|secondary|recommendation)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return "";
}

/**
 * Extract secondary analysis section
 */
function extractSecondaryAnalysis(text: string, domain: string): string {
  const patterns = [
    new RegExp(`${domain}[^:]*:([^]*?)(?:recommendation|\\n\\n|$)`, 'i'),
    new RegExp(`secondary[^:]*:([^]*?)(?:recommendation|\\n\\n|$)`, 'i'),
    new RegExp(`2\\.[^]*?([^]*?)(?:3\\.|recommendation|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return "";
}

/**
 * Extract technical details if the query relates to digital evidence
 */
function extractTechnicalDetails(query: string, text: string): any {
  const isDigitalQuery = query.toLowerCase().includes('digital') || 
                        query.toLowerCase().includes('cyber') || 
                        query.toLowerCase().includes('electronic') ||
                        query.toLowerCase().includes('evidence');
                        
  if (!isDigitalQuery) return undefined;
  
  return {
    hashingTechniques: [
      { algorithm: "SHA-256", description: "Cryptographic hash function for evidence integrity" },
      { algorithm: "MD5", description: "Legacy hash function for basic verification" }
    ],
    chainOfCustody: [
      { step: "Collection", requirements: "Document source, time, and method of digital evidence collection" },
      { step: "Preservation", requirements: "Create forensic images and maintain original evidence" }
    ],
    integrityVerification: "sha256sum evidence.bin > evidence.sha256\nsha256sum -c evidence.sha256"
  };
}

/**
 * Generate enhanced fallback analysis using AI context
 */
function generateEnhancedFallbackAnalysis(domain: string, query: string, aiContext: string): string {
  const baseAnalysis = generateFallbackAnalysis(domain, query);
  
  if (aiContext && aiContext.length > 50) {
    // Try to incorporate some AI context
    const relevantParts = aiContext.substring(0, 200).replace(/[^\w\s.,!?]/g, '');
    return `${baseAnalysis}\n\nAdditional context: ${relevantParts}...`;
  }
  
  return baseAnalysis;
}

/**
 * Generate fallback analysis when Hugging Face API is unavailable
 * @param domain The legal domain
 * @param query The user's query
 * @returns A basic domain-specific analysis
 */
function generateFallbackAnalysis(domain: string, query: string): string {
  const fallbackAnalyses: Record<string, string> = {
    contract: `Contract law analysis for "${query}": Contracts require offer, acceptance, consideration, intention to create legal relations, and certainty of terms. Courts interpret contracts by examining the plain meaning of terms and the parties' intentions. Key remedies for breach include damages, specific performance, and injunctions.`,
    
    property: `Property law analysis for "${query}": Property rights encompass ownership, possession, and various interests in real and personal property. Key concepts include title, adverse possession, easements, and covenants. Courts examine rightful ownership, competing claims, and statutory requirements when resolving property disputes.`,
    
    tort: `Tort law analysis for "${query}": Tort law provides remedies for civil wrongs causing harm to individuals or property. The fundamental principle requires those who cause harm through negligent or intentional conduct to compensate the injured party. Courts examine duty of care, breach, causation, and damages.`,
    
    constitutional: `Constitutional law analysis for "${query}": Constitutional interpretation involves applying fundamental principles to government powers and individual rights. Courts balance competing interests while ensuring compliance with constitutional provisions. Key considerations include separation of powers, individual liberties, and equal protection principles.`,
    
    criminal: `Criminal law analysis for "${query}": Criminal law defines prohibited conduct and establishes penalties. The prosecution must prove guilt beyond reasonable doubt. Key principles include presumption of innocence, burden of proof, and available defenses. Courts ensure procedural fairness while protecting both accused rights and public safety.`,
    
    zambian: `Zambian law analysis for "${query}": Zambian legal system combines English common law with statutory modifications and customary law influences. The system recognizes both received English law and local customary practices, particularly in personal status and land tenure matters. Courts apply these sources hierarchically based on the Constitution.`,
    
    cyberSecurity: `Cyber security law analysis for "${query}": Digital evidence and cyber security law address legal issues in technology contexts including data protection, privacy regulations, cybercrime prosecution, and digital evidence handling. Key considerations include data integrity, chain of custody for digital evidence, and compliance with relevant cyber security frameworks.`
  };

  return fallbackAnalyses[domain] || `Legal analysis for "${query}": This matter requires examination of relevant statutes, case law, and legal principles. For comprehensive guidance on the specific legal issues presented, consultation with a qualified legal professional is recommended.`;
}
