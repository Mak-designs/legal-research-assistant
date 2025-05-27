@@ -1,22 +1,21 @@
// Gemini integration module for legal research

// OpenAI integration module for legal research

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

/**
 * Generate AI-powered legal response using OpenAI
 * Generate AI-powered legal response using Google's Gemini
* @param query The user's legal query
* @param primaryDomain Primary legal domain for the query
* @param secondaryDomain Secondary legal domain for the query
 * @param systemPrompt The system prompt for the OpenAI model
 * @param systemPrompt The system prompt for the Gemini model
* @param jurisdiction The jurisdiction context (e.g., "zambian", "general")
* @returns Legal analysis and recommendation
*/
export async function generateAILegalResponse(query: string, primaryDomain: string, secondaryDomain: string, systemPrompt: string, jurisdiction: string) {
  if (!openaiApiKey) {
    console.error("Missing OpenAI API key");
  if (!geminiApiKey) {
    console.error("Missing Gemini API key");
return {
      recommendation: "Unable to generate AI recommendation. Please check that the OpenAI API key is configured.",
      recommendation: "Unable to generate AI recommendation. Please check that the Gemini API key is configured.",
primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
error: "missing_api_key"
@@ -26,31 +25,45 @@ export async function generateAILegalResponse(query: string, primaryDomain: stri
try {
console.log("Generating AI response for query:", query.substring(0, 50) + "...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
    // Gemini API endpoint
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    // Construct the full URL with API key
    const url = `${apiUrl}?key=${geminiApiKey}`;
    
    // Build the prompt by combining the system prompt and user query
    const fullPrompt = `${systemPrompt}\n\nAnalyze this legal query: "${query}"\n\nPlease format your response as a JSON object with the following fields: "recommendation", "primaryAnalysis", "secondaryAnalysis", and "technicalDetails".`;
    
    const response = await fetch(url, {
method: "POST",
headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
        "Content-Type": "application/json"
},
body: JSON.stringify({
        model: "gpt-4o-mini", // Using the more affordable model to avoid quota issues
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this legal query: "${query}"` }
        contents: [
          {
            parts: [
              { text: fullPrompt }
            ]
          }
],
        temperature: 0.7, // Slightly higher temperature for more conversational tone
        max_tokens: 2000
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
      console.error("OpenAI API error:", data);
      console.error("Gemini API error:", data);

// Handle quota exceeded error specifically
      if (response.status === 429 || (data.error?.type === "insufficient_quota")) {
      if (response.status === 429 || data.error?.code === 429) {
return {
recommendation: "The AI legal analysis service is currently unavailable due to API quota limitations. Please try again later or contact support to upgrade the API plan.",
primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
@@ -64,7 +77,9 @@ export async function generateAILegalResponse(query: string, primaryDomain: stri

// Parse the JSON from the AI response
try {
      const responseText = data.choices[0].message.content;
      // Extract text content from Gemini response structure
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
// Extract the JSON object from the response text
const jsonMatch = responseText.match(/\{[\s\S]*\}/);
const jsonString = jsonMatch ? jsonMatch[0] : '{}';
@@ -80,9 +95,13 @@ export async function generateAILegalResponse(query: string, primaryDomain: stri
};
} catch (parseError) {
console.error("Failed to parse AI response:", parseError);
      
      // Get the raw text from the Gemini response
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
      
// Fallback to directly using the text
return {
        recommendation: data.choices[0].message.content.substring(0, 500),
        recommendation: responseText.substring(0, 500),
primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
error: "parse_error"
@@ -100,7 +119,7 @@ export async function generateAILegalResponse(query: string, primaryDomain: stri
}

/**
 * Generate fallback analysis when OpenAI API is unavailable
 * Generate fallback analysis when Gemini API is unavailable
* @param domain The legal domain
* @param query The user's query
* @returns A basic domain-specific analysis
