
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const useLegalSearch = (initialQuery: string | null = null) => {
  const [query, setQuery] = useState<string>(initialQuery || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);
  const [jurisdiction] = useState<string>("zambian"); // Fixed to Zambian
  const [apiStatus, setApiStatus] = useState<"available" | "quota_exceeded" | "error" | null>(null);

  // Dummy setJurisdiction to maintain interface compatibility
  const setJurisdiction = () => {};

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a legal query to analyze.");
      return;
    }
    
    setIsLoading(true);
    setApiStatus(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Enhance the query with Zambian law context
      let enhancedQuery = `Zambian law: ${query}`;
      
      // Add specific keywords for digital evidence if relevant
      if (query.toLowerCase().includes('evidence') || 
          query.toLowerCase().includes('digital') || 
          query.toLowerCase().includes('electronic')) {
        enhancedQuery += " considering Cyber Security and Cyber Crimes Act No. 2 of 2021 and Zambian Evidence Act";
      }
      
      // Use the AI-powered legal research function
      const { data, error } = await supabase.functions.invoke('ai-legal-research', {
        body: { 
          query: enhancedQuery,
          jurisdiction: "zambian"
        }
      });
      
      if (error) throw error;
      
      console.log("AI legal research results:", data);
      
      // Check for API status in the response
      if (data.aiResponse?.error === "quota_exceeded") {
        setApiStatus("quota_exceeded");
        toast.warning("AI analysis is limited due to API quota. Standard analysis is shown instead.", {
          duration: 6000
        });
      } else if (data.aiResponse?.error) {
        setApiStatus("error");
      } else {
        setApiStatus("available");
      }
      
      // Always save the search in history when successful
      if (session?.user) {
        try {
          await supabase.from('search_history').insert({
            query: `[Zambian] ${query}`,
            user_id: session.user.id,
            results_count: data.comparison.commonLaw.caseExamples.length + 
                          data.comparison.contractLaw.caseExamples.length
          });
        } catch (historyError) {
          console.error("Failed to save search history:", historyError);
        }
      }
      
      setResults(data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Analysis failed. Please try again later.");
      setApiStatus("error");
      
      // Fallback to the original legal-search function if AI function fails
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        let enhancedQuery = `Zambian law: ${query}`;
        
        if (query.toLowerCase().includes('evidence') || 
            query.toLowerCase().includes('digital') || 
            query.toLowerCase().includes('electronic')) {
          enhancedQuery += " considering Cyber Security and Cyber Crimes Act No. 2 of 2021 and Zambian Evidence Act";
        }
        
        const { data, error } = await supabase.functions.invoke('legal-search', {
          body: { 
            query: enhancedQuery
          }
        });
        
        if (error) throw error;
        
        if (session?.user) {
          try {
            await supabase.from('search_history').insert({
              query: `[Zambian] ${query} (fallback)`,
              user_id: session.user.id,
              results_count: data.comparison.commonLaw.caseExamples.length + 
                            data.comparison.contractLaw.caseExamples.length
            });
          } catch (historyError) {
            console.error("Failed to save search history:", historyError);
          }
        }
        
        setResults(data);
        toast.success("Analysis complete (standard mode)!");
      } catch (fallbackError) {
        console.error("Fallback search error:", fallbackError);
        toast.error("All analysis methods failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    query,
    setQuery,
    isLoading,
    results,
    jurisdiction,
    setJurisdiction,
    apiStatus,
    handleSearch
  };
};
