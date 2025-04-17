
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  Loader2,
  Search,
  BookOpen,
  Scale,
  Book,
  Globe
} from "lucide-react";
import ComparisonResults from "@/components/comparison/ComparisonResults";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComparisonToolProps {
  initialQuery?: string | null;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ initialQuery = null }) => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);
  const [jurisdiction, setJurisdiction] = useState<string>("general");

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
      
      // Include jurisdiction in the request
      const { data, error } = await supabase.functions.invoke('legal-search', {
        body: { 
          query: jurisdiction === "zambian" ? `Zambian law: ${query}` : query
        }
      });
      
      if (error) throw error;
      
      if (session?.user) {
        try {
          await supabase.from('search_history').insert({
            query: `${jurisdiction === "zambian" ? "[Zambian] " : ""}${query}`,
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="w-full sm:w-1/3">
                <label htmlFor="jurisdiction" className="text-sm font-medium mb-2 block">
                  Jurisdiction
                </label>
                <Select 
                  value={jurisdiction} 
                  onValueChange={setJurisdiction} 
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full" id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        General
                      </div>
                    </SelectItem>
                    <SelectItem value="zambian">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Zambian
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end items-end">
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
            </div>
          </form>
        </CardContent>
      </Card>
      
      {results && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Scale className="mr-2 h-5 w-5 text-accent" />
            Legal Comparison Results
            {jurisdiction === "zambian" && (
              <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Zambian Jurisdiction
              </span>
            )}
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
