
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
    const { query, jurisdiction = "general", chatHistory = [] } = await req.json();
    
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

    // Gather relevant information from our legal dataset
    const primaryDomainData = legalDataset[primaryDomain];
    const secondaryDomainData = legalDataset[secondaryDomain];
    
    // Format the legal data for our AI prompt
    const legalContext = formatLegalDataForAI(primaryDomainData, secondaryDomainData, jurisdiction);
    
    // Generate AI response based on the legal context, query, and chat history
    const aiResponse = await generateAILegalResponse(query, legalContext, jurisdiction, chatHistory);

    // Prepare the response data with comprehensive analysis
    const responseData = {
      query,
      domains: [primaryDomain, secondaryDomain],
      aiResponse,
      conversationalResponse: aiResponse.conversationalResponse,
      // Include existing data structure for compatibility
      recommendation: aiResponse.recommendation || aiResponse.conversationalResponse,
      technicalDetails: aiResponse.technicalDetails,
      comparison: {
        commonLaw: {
          analysis: aiResponse.primaryAnalysis || primaryDomainData.analysis,
          principles: primaryDomainData.principles,
          caseExamples: primaryDomainData.cases.slice(0, 3).map(
            (c: any) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: primaryDomainData.statutes.slice(0, 2).map(
            (s: any) => `${s.title} (${s.citation}): ${s.description}`
          ),
        },
        contractLaw: {
          analysis: aiResponse.secondaryAnalysis || secondaryDomainData.analysis,
          principles: secondaryDomainData.principles,
          caseExamples: secondaryDomainData.cases.slice(0, 3).map(
            (c: any) => `${c.title} (${c.citation}): ${c.description}`
          ),
          statutes: secondaryDomainData.statutes.slice(0, 2).map(
            (s: any) => `${s.title} (${s.citation}): ${s.description}`
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

// Format our legal dataset into a prompt context for the AI
function formatLegalDataForAI(primaryDomainData: any, secondaryDomainData: any, jurisdiction: string) {
  const formatDomain = (domain: any) => {
    let context = `Analysis: ${domain.analysis}\n\n`;
    
    context += "Key Principles:\n";
    domain.principles.forEach((principle: string, i: number) => {
      context += `- ${principle}\n`;
    });
    
    context += "\nRelevant Cases:\n";
    domain.cases.slice(0, 5).forEach((c: any) => {
      context += `- ${c.title} (${c.citation}): ${c.description}\n`;
    });
    
    context += "\nRelevant Statutes:\n";
    domain.statutes.slice(0, 3).forEach((s: any) => {
      context += `- ${s.title} (${s.citation}): ${s.description}\n`;
    });
    
    return context;
  };
  
  let context = "The following is legal information from verified legal sources:\n\n";
  context += `PRIMARY DOMAIN: ${formatDomain(primaryDomainData)}\n\n`;
  context += `SECONDARY DOMAIN: ${formatDomain(secondaryDomainData)}\n\n`;
  
  if (jurisdiction === "zambian") {
    context += "ZAMBIAN LEGAL CONTEXT:\n";
    context += formatDomain(legalDataset.zambian);
  }
  
  return context;
}

// Generate AI-powered legal response using OpenAI
async function generateAILegalResponse(
  query: string, 
  legalContext: string, 
  jurisdiction: string, 
  chatHistory: Array<{role: string, content: string}> = []
) {
  if (!openaiApiKey) {
    console.error("Missing OpenAI API key");
    return {
      recommendation: "Unable to generate AI recommendation. Please contact support.",
      primaryAnalysis: null,
      secondaryAnalysis: null,
      conversationalResponse: "I'm sorry, but I can't provide a response at this moment. Please contact support."
    };
  }

  try {
    // Create system prompt that forces the AI to only use our provided legal information
    const systemPrompt = `You are a specialized legal assistant with expertise in comparative legal analysis.
    You must ONLY use the legal information I provide to answer questions.
    Respond in a conversational, friendly, and helpful manner like ChatGPT, but ONLY use information from the provided legal data.
    Do NOT introduce external legal concepts, cases, or statutes that aren't in the provided data.
    Format your responses in a clear, direct, and engaging conversational style.
    ${jurisdiction === "zambian" ? "Emphasize Zambian legal context and cybersecurity laws where relevant." : ""}
    If you cannot answer a question based solely on the provided information, acknowledge the limitations of the available data.`;

    // Prepare messages array with past conversation context
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Here is legal information to use for your responses:\n\n${legalContext}` }
    ];
    
    // Add any chat history if available
    if (chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }
    
    // Add the current query
    messages.push({
      role: "user", 
      content: `Based ONLY on the legal information provided earlier, answer this query: "${query}"`
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
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

    // Extract the conversational response
    const conversationalResponse = data.choices[0].message.content;
    
    // Get detailed analysis (make a second call for this)
    const detailedMessages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Here is legal information to use for your response:\n\n${legalContext}` },
      { role: "user", content: `Based ONLY on the legal information provided above, please analyze this query: "${query}". 
      Return your response as JSON with these fields:
      recommendation: A concise legal recommendation addressing the query
      primaryAnalysis: Detailed analysis from the primary legal domain
      secondaryAnalysis: Comparative analysis from the secondary domain
      technicalDetails: (Only for cybersecurity queries) Technical verification methods and standards` }
    ];

    const detailedResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: detailedMessages,
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    const detailedData = await detailedResponse.json();
    
    // Parse the JSON from the detailed AI response
    try {
      const responseText = detailedData.choices[0].message.content;
      // Extract the JSON object from the response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsedResponse = JSON.parse(jsonString);
      
      return {
        conversationalResponse,
        recommendation: parsedResponse.recommendation || "Analysis not available based on provided information.",
        primaryAnalysis: parsedResponse.primaryAnalysis,
        secondaryAnalysis: parsedResponse.secondaryAnalysis,
        technicalDetails: parsedResponse.technicalDetails
      };
    } catch (parseError) {
      console.error("Failed to parse detailed AI response:", parseError);
      // Fallback to directly using the conversational response
      return {
        conversationalResponse,
        recommendation: conversationalResponse.substring(0, 500),
        primaryAnalysis: null,
        secondaryAnalysis: null
      };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      conversationalResponse: "Error generating legal analysis. Please try again later.",
      recommendation: "Error generating legal analysis. Please try again later.",
      primaryAnalysis: null,
      secondaryAnalysis: null
    };
  }
}
