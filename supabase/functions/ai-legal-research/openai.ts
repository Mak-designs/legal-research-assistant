
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
      recommendation: "Unable to generate AI recommendation. Please contact support.",
      primaryAnalysis: null,
      secondaryAnalysis: null
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this legal query: "${query}"` }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    console.log("AI response status:", response.status);
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Failed to generate AI response");
    }

    // Parse the JSON from the AI response
    try {
      const responseText = data.choices[0].message.content;
      // Extract the JSON object from the response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsedResponse = JSON.parse(jsonString);
      
      return {
        recommendation: parsedResponse.recommendation || "Analysis not available based on provided information.",
        primaryAnalysis: parsedResponse.primaryAnalysis || "No specific analysis available for this query.",
        secondaryAnalysis: parsedResponse.secondaryAnalysis || "No comparative analysis available for this query.",
        technicalDetails: parsedResponse.technicalDetails
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to directly using the text
      return {
        recommendation: data.choices[0].message.content.substring(0, 500),
        primaryAnalysis: "Error parsing AI response. Please try rephrasing your query.",
        secondaryAnalysis: "Error parsing AI response. Please try rephrasing your query."
      };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      recommendation: "Error generating legal analysis. Please try again later.",
      primaryAnalysis: null,
      secondaryAnalysis: null
    };
  }
}
