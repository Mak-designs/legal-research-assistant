
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Loader2, Search, BookOpen, Scale, Book } from "lucide-react";
import ComparisonResults from "@/components/comparison/ComparisonResults";
import { supabase } from "@/integrations/supabase/client";

interface ComparisonToolProps {
  initialQuery?: string | null;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ initialQuery = null }) => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  }, [initialQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a legal query to analyze.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('legal-search', {
        body: { query: query }
      });
      
      if (error) throw error;
      
      if (session?.user) {
        try {
          await supabase.from('search_history').insert({
            query: query,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="legal-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="query" className="text-sm font-medium">
                Enter your legal research query
              </label>
              <Textarea
                id="query"
                placeholder="e.g., What are the differences between common law and contract law regarding property rights?"
                className="min-h-32 resize-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {results && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Scale className="mr-2 h-5 w-5 text-accent" />
            Legal Comparison Results
          </h2>
          
          <Tabs defaultValue="comparison">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comparison">
                <div className="flex items-center">
                  <Scale className="mr-2 h-4 w-4" />
                  Comparison
                </div>
              </TabsTrigger>
              <TabsTrigger value="detailed">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Detailed Analysis
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison" className="mt-4">
              <ComparisonResults results={results} />
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Query</h3>
                    <p className="text-muted-foreground">{results.query}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Recommendation</h3>
                    <p>{results.recommendation}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Common Law Analysis</h3>
                    <p>{results.comparison.commonLaw.analysis}</p>
                    
                    <h4 className="text-lg font-medium mt-2 flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      Relevant Cases
                    </h4>
                    <ul className="list-disc list-inside">
                      {results.comparison.commonLaw.caseExamples.map((example: string, index: number) => (
                        <li key={index} className="text-sm">{example}</li>
                      ))}
                    </ul>
                    
                    <h4 className="text-lg font-medium mt-2 flex items-center">
                      <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                      Relevant Statutes
                    </h4>
                    <ul className="list-disc list-inside">
                      {results.comparison.commonLaw.statutes?.map((statute: string, index: number) => (
                        <li key={index} className="text-sm">{statute}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Contract Law Analysis</h3>
                    <p>{results.comparison.contractLaw.analysis}</p>
                    
                    <h4 className="text-lg font-medium mt-2 flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      Relevant Cases
                    </h4>
                    <ul className="list-disc list-inside">
                      {results.comparison.contractLaw.caseExamples.map((example: string, index: number) => (
                        <li key={index} className="text-sm">{example}</li>
                      ))}
                    </ul>
                    
                    <h4 className="text-lg font-medium mt-2 flex items-center">
                      <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                      Relevant Statutes
                    </h4>
                    <ul className="list-disc list-inside">
                      {results.comparison.contractLaw.statutes?.map((statute: string, index: number) => (
                        <li key={index} className="text-sm">{statute}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;
