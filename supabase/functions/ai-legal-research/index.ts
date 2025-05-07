
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeQuery } from "../legal-search/analyzeQuery.ts";
import { legalDataset } from "../legal-search/legalDataset.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, jurisdiction = "general" } = await req.json();
    
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid query parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // First analyze the query to determine relevant legal domains
    const [primaryDomain, secondaryDomain] = analyzeQuery(query);
    
    // Enhanced logging for debugging
    console.log(`AI Legal Research: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}\n`);

    // Format prompt for GPT to generate detailed, query-specific analysis
    const systemPrompt = `You are an expert legal research assistant with extensive knowledge in ${primaryDomain} law and ${secondaryDomain} law.
    You are tasked with providing a comprehensive analysis of the following legal query: "${query}"
    
    ${jurisdiction === "zambian" ? "You should emphasize Zambian legal context and cybersecurity laws where relevant." : ""}
    
    Base your analysis ONLY on verified legal information. Your response must include:
    
    1. A detailed analysis for ${primaryDomain} law aspects of the query
    2. A comparative analysis for ${secondaryDomain} law perspectives
    3. A concise legal recommendation addressing the query
    4. If relevant to digital evidence or cybersecurity, include technical verification standards
    
    Format your response as JSON with these fields:
    - primaryAnalysis: Detailed analysis from ${primaryDomain} law perspective
    - secondaryAnalysis: Analysis from ${secondaryDomain} law perspective
    - recommendation: Concise legal recommendation
    - technicalDetails (only for cybersecurity queries): Verification methods and standards
    
    Your analysis should be specific to the query and provide actionable insights.`;

    // Generate AI response
    const aiResponse = await generateAILegalResponse(query, primaryDomain, secondaryDomain, systemPrompt, jurisdiction);
    
    // Extract relevant cases and statutes from our dataset based on the query
    const relevantPrimaryCases = findRelevantCases(query, legalDataset[primaryDomain].cases);
    const relevantPrimaryStatutes = findRelevantStatutes(query, legalDataset[primaryDomain].statutes);
    const relevantSecondaryStatutes = findRelevantStatutes(query, legalDataset[secondaryDomain].statutes);
    const relevantSecondaryCases = findRelevantCases(query, legalDataset[secondaryDomain].cases);

    // Prepare the response data with comprehensive analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      recommendation: aiResponse.recommendation,
      technicalDetails: aiResponse.technicalDetails,
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || "Analysis not available",
          principles: extractRelevantPrinciples(query, legalDataset[primaryDomain].principles),
          caseExamples: relevantPrimaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: relevantPrimaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || "Analysis not available",
          principles: extractRelevantPrinciples(query, legalDataset[secondaryDomain].principles),
          caseExamples: relevantSecondaryCases.map(
            (c) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: relevantSecondaryStatutes.map(
            (s) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing AI legal research:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process legal query" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Generate AI-powered legal response using OpenAI
async function generateAILegalResponse(query, primaryDomain, secondaryDomain, systemPrompt, jurisdiction) {
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

// Find relevant cases based on query keywords
function findRelevantCases(query, cases) {
  if (!cases || !Array.isArray(cases)) return [];
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'that', 'with', 'from'].includes(word)
  );
  
  // Score each case based on query relevance
  const scoredCases = cases.map(caseObj => {
    let score = 0;
    const caseText = (caseObj.title + ' ' + caseObj.description).toLowerCase();
    
    // Calculate relevance score based on keyword matches
    queryWords.forEach(word => {
      if (caseText.includes(word)) {
        score += 1;
        // Higher score for title matches
        if (caseObj.title.toLowerCase().includes(word)) {
          score += 0.5;
        }
      }
    });
    
    return { case: caseObj, score };
  });
  
  // Sort by relevance and get top results
  scoredCases.sort((a, b) => b.score - a.score);
  
  // If no strong matches, still return some cases but fewer
  if (scoredCases[0]?.score < 1) {
    return cases.slice(0, 2);
  }
  
  // Return top relevant cases
  return scoredCases.slice(0, 3).map(item => item.case);
}

// Find relevant statutes based on query
function findRelevantStatutes(query, statutes) {
  if (!statutes || !Array.isArray(statutes)) return [];
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'that', 'with', 'from'].includes(word)
  );
  
  // Score each statute based on query relevance
  const scoredStatutes = statutes.map(statute => {
    let score = 0;
    const statuteText = (statute.title + ' ' + statute.description).toLowerCase();
    
    queryWords.forEach(word => {
      if (statuteText.includes(word)) {
        score += 1;
        // Higher score for title matches
        if (statute.title.toLowerCase().includes(word)) {
          score += 0.5;
        }
      }
    });
    
    return { statute, score };
  });
  
  // Sort by relevance score
  scoredStatutes.sort((a, b) => b.score - a.score);
  
  // If no strong matches, return some default statutes but fewer
  if (scoredStatutes[0]?.score < 1) {
    return statutes.slice(0, 2);
  }
  
  // Return most relevant statutes
  return scoredStatutes.slice(0, 2).map(item => item.statute);
}

// Extract relevant principles based on the query
function extractRelevantPrinciples(query, principles) {
  if (!principles || !Array.isArray(principles)) return [];
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'that', 'with', 'from'].includes(word)
  );
  
  // Score each principle based on query relevance
  const scoredPrinciples = principles.map(principle => {
    let score = 0;
    const principleText = principle.toLowerCase();
    
    queryWords.forEach(word => {
      if (principleText.includes(word)) {
        score += 1;
      }
    });
    
    return { principle, score };
  });
  
  // Sort by relevance score
  scoredPrinciples.sort((a, b) => b.score - a.score);
  
  // Return most relevant principles or default if no strong matches
  return scoredPrinciples.slice(0, 4).map(item => item.principle);
}
