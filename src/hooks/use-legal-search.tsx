
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useLegalSearch = (initialQuery: string | null = null) => {
  const [query, setQuery] = useState<string>(initialQuery || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);
  const [jurisdiction, setJurisdiction] = useState<string>("general");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a legal query to analyze.");
      return;
    }
    
    setIsLoading(true);
    
    // Add user message to chat history
    const userMessage: ChatMessage = { role: 'user', content: query };
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Enhance the query with jurisdiction context
      let enhancedQuery = query;
      if (jurisdiction === "zambian") {
        enhancedQuery = `Zambian law: ${query}`;
        
        // Add specific keywords for digital evidence if relevant
        if (query.toLowerCase().includes('evidence') || 
            query.toLowerCase().includes('digital') || 
            query.toLowerCase().includes('electronic')) {
          enhancedQuery += " considering Cyber Security and Cyber Crimes Act No. 2 of 2021 and Zambian Evidence Act";
        }
      }
      
      // Add chat context from previous messages (up to 3 most recent exchanges)
      const recentContext = updatedChatHistory.slice(-6);
      
      // Use the AI-powered legal research function with improved error handling
      const { data, error } = await supabase.functions.invoke('ai-legal-research', {
        body: { 
          query: enhancedQuery,
          jurisdiction: jurisdiction,
          chatHistory: recentContext
        }
      });
      
      if (error) throw error;
      
      // Always save the search in history when successful
      if (session?.user) {
        try {
          await supabase.from('search_history').insert({
            query: `${jurisdiction === "zambian" ? "[Zambian] " : ""}${query}`,
            user_id: session.user.id,
            results_count: data.comparison?.commonLaw?.caseExamples?.length + 
                          data.comparison?.contractLaw?.caseExamples?.length || 0
          });
        } catch (historyError) {
          console.error("Failed to save search history:", historyError);
        }
      }
      
      // Add assistant response to chat history
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.conversationalResponse || data.recommendation 
      };
      setChatHistory([...updatedChatHistory, assistantMessage]);
      
      setResults(data);
      toast.success("Analysis complete!");
      
      // Clear the input field after successful search
      setQuery("");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Analysis failed. Please try again later.");
      
      // Fallback to the original legal-search function if AI function fails
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        let enhancedQuery = query;
        if (jurisdiction === "zambian") {
          enhancedQuery = `Zambian law: ${query}`;
          
          if (query.toLowerCase().includes('evidence') || 
              query.toLowerCase().includes('digital') || 
              query.toLowerCase().includes('electronic')) {
            enhancedQuery += " considering Cyber Security and Cyber Crimes Act No. 2 of 2021 and Zambian Evidence Act";
          }
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
              query: `${jurisdiction === "zambian" ? "[Zambian] " : ""}${query} (fallback)`,
              user_id: session.user.id,
              results_count: data.comparison.commonLaw.caseExamples.length + 
                            data.comparison.contractLaw.caseExamples.length
            });
          } catch (historyError) {
            console.error("Failed to save search history:", historyError);
          }
        }
        
        // Add basic assistant response to chat history
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: data.recommendation 
        };
        setChatHistory([...updatedChatHistory, assistantMessage]);
        
        setResults(data);
        toast.success("Analysis complete (standard mode)!");
        
        // Clear the input field after successful search
        setQuery("");
      } catch (fallbackError) {
        console.error("Fallback search error:", fallbackError);
        toast.error("All analysis methods failed. Please try again later.");
        
        // Add error message to chat history
        const errorMessage: ChatMessage = { 
          role: 'assistant', 
          content: "I'm sorry, but I couldn't retrieve an answer at this time. Please try again later." 
        };
        setChatHistory([...updatedChatHistory, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setResults(null);
  };

  return {
    query,
    setQuery,
    isLoading,
    results,
    jurisdiction,
    setJurisdiction,
    handleSearch,
    chatHistory,
    clearChat
  };
};
