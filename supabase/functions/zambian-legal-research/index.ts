
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid query parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Processing Zambian legal query: "${query.substring(0, 50)}..."`);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Search for relevant Zambian cases using full-text search
    const { data: zambianCases, error: casesError } = await supabase
      .from('zambian_cases')
      .select('*')
      .or(`title.ilike.%${query}%,case_summary.ilike.%${query}%,legal_principles.cs.{${query}},keywords.cs.{${query}}`)
      .limit(10);

    if (casesError) {
      console.error("Error fetching Zambian cases:", casesError);
    }

    // Search for relevant Zambian statutes
    const { data: zambianStatutes, error: statutesError } = await supabase
      .from('zambian_statutes')
      .select('*')
      .or(`title.ilike.%${query}%,statute_text.ilike.%${query}%,summary.ilike.%${query}%,keywords.cs.{${query}}`)
      .eq('status', 'active')
      .limit(10);

    if (statutesError) {
      console.error("Error fetching Zambian statutes:", statutesError);
    }

    console.log(`Found ${zambianCases?.length || 0} relevant cases and ${zambianStatutes?.length || 0} relevant statutes`);

    // Generate analysis based on found cases and statutes
    const analysis = generateZambianLegalAnalysis(query, zambianCases || [], zambianStatutes || []);

    // Prepare the response data
    const responseData = {
      query,
      jurisdiction: "zambian",
      analysis,
      zambianCases: zambianCases || [],
      zambianStatutes: zambianStatutes || [],
      totalFound: {
        cases: zambianCases?.length || 0,
        statutes: zambianStatutes?.length || 0
      }
    };

    console.log('Zambian legal research completed successfully');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing Zambian legal research:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process Zambian legal query",
        details: error.message
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

function generateZambianLegalAnalysis(query: string, cases: any[], statutes: any[]) {
  const relevantCases = cases.slice(0, 5);
  const relevantStatutes = statutes.slice(0, 5);
  
  let analysis = `Based on your query about "${query}", here is an analysis under Zambian law:\n\n`;
  
  // Add case law analysis
  if (relevantCases.length > 0) {
    analysis += "**Relevant Case Law:**\n\n";
    relevantCases.forEach((caseItem, index) => {
      analysis += `${index + 1}. **${caseItem.title}** (${caseItem.citation})\n`;
      analysis += `   Court: ${caseItem.court_name || 'Not specified'}\n`;
      analysis += `   Date: ${caseItem.decision_date || 'Not specified'}\n`;
      analysis += `   Summary: ${caseItem.case_summary}\n`;
      if (caseItem.legal_principles && caseItem.legal_principles.length > 0) {
        analysis += `   Legal Principles: ${caseItem.legal_principles.join(', ')}\n`;
      }
      analysis += "\n";
    });
  }
  
  // Add statutory analysis
  if (relevantStatutes.length > 0) {
    analysis += "**Relevant Legislation:**\n\n";
    relevantStatutes.forEach((statute, index) => {
      analysis += `${index + 1}. **${statute.title}** (${statute.citation})\n`;
      if (statute.section_number) {
        analysis += `   Section: ${statute.section_number}\n`;
      }
      analysis += `   Summary: ${statute.summary}\n`;
      analysis += `   Text: ${statute.statute_text.substring(0, 200)}${statute.statute_text.length > 200 ? '...' : ''}\n\n`;
    });
  }
  
  // Add legal recommendation
  analysis += "**Legal Analysis and Recommendation:**\n\n";
  
  if (query.toLowerCase().includes('digital') || query.toLowerCase().includes('evidence') || query.toLowerCase().includes('electronic')) {
    analysis += "Under Zambian law, digital evidence is governed by the Zambian Evidence Act and the Cyber Security and Cyber Crimes Act No. 2 of 2021. ";
    analysis += "Digital evidence must meet authentication requirements and maintain proper chain of custody to be admissible in court proceedings. ";
    analysis += "The Electronic Communications and Transactions Act also provides framework for electronic signatures and digital transactions.\n\n";
  }
  
  if (relevantCases.length > 0 || relevantStatutes.length > 0) {
    analysis += `Based on the ${relevantCases.length} case${relevantCases.length !== 1 ? 's' : ''} and ${relevantStatutes.length} statute${relevantStatutes.length !== 1 ? 's' : ''} found, `;
    analysis += "it is recommended to carefully review the specific legal principles and statutory provisions that apply to your situation. ";
    analysis += "Consider consulting with a qualified Zambian legal practitioner for detailed advice specific to your circumstances.";
  } else {
    analysis += "While no specific cases or statutes were found directly matching your query, ";
    analysis += "it is recommended to conduct a broader search and consult with a qualified Zambian legal practitioner ";
    analysis += "for advice specific to your legal matter under Zambian law.";
  }
  
  return analysis;
}
