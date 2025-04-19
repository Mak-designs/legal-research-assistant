
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeQuery } from './analyzeQuery.ts';
import { generateRecommendation, generateTechnicalDetails } from './generateResults.ts';
import { legalDataset } from './legalDataset.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    // Analyze query to determine relevant legal domains
    const relevantDomains = analyzeQuery(query);
    
    // Organize data for response, with primary and secondary domains
    const primaryDomain = relevantDomains[0];
    const secondaryDomain = relevantDomains[1] || 'contract';
    
    // Determine relevance labels based on match
    const primaryRelevance = "High relevance";
    const secondaryRelevance = relevantDomains.length > 1 ? "Medium relevance" : "Low relevance";
    
    const results = {
      query: query,
      timestamp: new Date().toISOString(),
      comparison: {
        commonLaw: {
          principles: legalDataset[primaryDomain].principles,
          relevance: primaryRelevance + " to " + query,
          caseExamples: legalDataset[primaryDomain].cases.slice(0, 3).map(c => `${c.title} (${c.citation}) - ${c.description}`),
          statutes: legalDataset[primaryDomain].statutes.slice(0, 2).map(s => `${s.title} (${s.citation}) - ${s.description}`),
          analysis: legalDataset[primaryDomain].analysis
        },
        contractLaw: {
          principles: legalDataset[secondaryDomain].principles,
          relevance: secondaryRelevance + " to " + query,
          caseExamples: legalDataset[secondaryDomain].cases.slice(0, 3).map(c => `${c.title} (${c.citation}) - ${c.description}`),
          statutes: legalDataset[secondaryDomain].statutes.slice(0, 2).map(s => `${s.title} (${s.citation}) - ${s.description}`),
          analysis: legalDataset[secondaryDomain].analysis
        }
      },
      recommendation: generateRecommendation(query, primaryDomain, secondaryDomain),
      technicalDetails: generateTechnicalDetails(primaryDomain, secondaryDomain)
    };
    
    console.log(`Processed legal query: "${query}" - Domains: ${primaryDomain}, ${secondaryDomain}`);
    
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in legal search:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
