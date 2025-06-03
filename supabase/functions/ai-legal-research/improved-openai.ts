
// Improved OpenAI integration with better error handling and response validation

import { buildEnhancedSystemPrompt, validateLegalResponse, PromptContext } from './enhanced-prompting.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function generateImprovedLegalResponse(
  context: PromptContext
): Promise<any> {
  if (!openAIApiKey) {
    console.log("OpenAI API key not available, using fallback response");
    return {
      error: "api_unavailable",
      recommendation: generateFallbackResponse(context),
      primaryAnalysis: "OpenAI API is not available. Using document-based analysis.",
      secondaryAnalysis: null,
      technicalDetails: null
    };
  }

  try {
    const systemPrompt = buildEnhancedSystemPrompt(context);
    
    console.log(`Generating AI response for query: "${context.query}"`);
    console.log(`Using ${context.retrievedDocuments.length} retrieved documents`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent legal analysis
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log("OpenAI API quota exceeded");
        return {
          error: "quota_exceeded",
          recommendation: generateFallbackResponse(context),
          primaryAnalysis: "API quota exceeded. Using document-based analysis.",
          secondaryAnalysis: null,
          technicalDetails: null
        };
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response content from OpenAI");
    }
    
    // Validate the response quality
    const validation = validateLegalResponse(aiResponse, context.retrievedDocuments);
    
    if (!validation.isValid) {
      console.log("AI response validation failed:", validation.issues);
      // Could implement retry logic here or enhance the prompt
    }
    
    // Parse the AI response into structured format
    const structuredResponse = parseAIResponse(aiResponse, context);
    
    return {
      recommendation: structuredResponse.recommendation,
      primaryAnalysis: structuredResponse.primaryAnalysis,
      secondaryAnalysis: structuredResponse.secondaryAnalysis,
      technicalDetails: structuredResponse.technicalDetails,
      validation: validation
    };

  } catch (error) {
    console.error("Error generating AI legal response:", error);
    
    return {
      error: "generation_failed",
      recommendation: generateFallbackResponse(context),
      primaryAnalysis: `Analysis failed. Using available documents: ${context.retrievedDocuments.slice(0, 3).map(d => d.document.title).join(', ')}`,
      secondaryAnalysis: null,
      technicalDetails: null
    };
  }
}

function parseAIResponse(aiResponse: string, context: PromptContext): any {
  // Try to extract structured information from the AI response
  const lines = aiResponse.split('\n').filter(line => line.trim());
  
  let recommendation = '';
  let primaryAnalysis = '';
  let secondaryAnalysis = '';
  let technicalDetails = '';
  
  let currentSection = 'recommendation';
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('primary analysis') || lowerLine.includes('main analysis')) {
      currentSection = 'primary';
    } else if (lowerLine.includes('secondary analysis') || lowerLine.includes('additional')) {
      currentSection = 'secondary';
    } else if (lowerLine.includes('technical') || lowerLine.includes('procedure')) {
      currentSection = 'technical';
    } else {
      switch (currentSection) {
        case 'recommendation':
          recommendation += line + '\n';
          break;
        case 'primary':
          primaryAnalysis += line + '\n';
          break;
        case 'secondary':
          secondaryAnalysis += line + '\n';
          break;
        case 'technical':
          technicalDetails += line + '\n';
          break;
      }
    }
  });
  
  // If sections weren't clearly delineated, use the full response as recommendation
  if (!primaryAnalysis && !secondaryAnalysis) {
    recommendation = aiResponse;
    primaryAnalysis = generateDocumentBasedAnalysis(context.retrievedDocuments.slice(0, 3));
  }
  
  return {
    recommendation: recommendation.trim() || aiResponse,
    primaryAnalysis: primaryAnalysis.trim() || generateDocumentBasedAnalysis(context.retrievedDocuments.slice(0, 3)),
    secondaryAnalysis: secondaryAnalysis.trim() || null,
    technicalDetails: technicalDetails.trim() || null
  };
}

function generateFallbackResponse(context: PromptContext): string {
  const { query, retrievedDocuments, jurisdiction, legalDomain } = context;
  
  if (retrievedDocuments.length === 0) {
    return `I searched through the available legal documents but could not find specific authorities that directly address "${query}" in ${jurisdiction} ${legalDomain} law. This may require consultation of additional legal resources or specialized databases.`;
  }
  
  const topDocs = retrievedDocuments.slice(0, 3);
  let response = `Based on the available legal documents for your query "${query}", here are the relevant authorities:\n\n`;
  
  topDocs.forEach((doc, index) => {
    response += `${index + 1}. ${doc.document.title} (${doc.document.citation})\n`;
    response += `   ${doc.document.description}\n\n`;
  });
  
  response += `These documents provide the foundational legal framework for your question in ${jurisdiction} law. For a complete analysis, consider reviewing the full text of these authorities.`;
  
  return response;
}

function generateDocumentBasedAnalysis(documents: any[]): string {
  if (documents.length === 0) {
    return "No specific legal documents were found to provide detailed analysis.";
  }
  
  const topDoc = documents[0];
  let analysis = `According to ${topDoc.document.title} (${topDoc.document.citation}): ${topDoc.document.description}`;
  
  if (documents.length > 1) {
    analysis += ` Additionally, ${documents[1].document.title} provides relevant guidance on this matter.`;
  }
  
  return analysis;
}
