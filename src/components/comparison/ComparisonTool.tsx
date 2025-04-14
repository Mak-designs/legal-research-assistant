
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Loader2, Search, BookOpen, Scale } from "lucide-react";
import ComparisonResults from "@/components/comparison/ComparisonResults";

const ComparisonTool: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a legal query to analyze.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to an NLP service
      // For demo purposes, we'll simulate an analysis result
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockResults = {
        query: query,
        timestamp: new Date().toISOString(),
        comparison: {
          commonLaw: {
            principles: [
              "Relies on judicial precedent and case law",
              "Follows the doctrine of stare decisis",
              "Developed through court decisions over time",
              "Based on customary practices and societal norms"
            ],
            relevance: "High relevance to your query regarding property rights",
            caseExamples: [
              "Pierson v. Post (1805) - Established possession as basis for property rights",
              "Johnson v. M'Intosh (1823) - Addressed indigenous property rights"
            ],
            analysis: "Common law approaches your scenario by examining prior judicial decisions about similar property disputes. The principle of adverse possession may be particularly relevant."
          },
          contractLaw: {
            principles: [
              "Based on mutual agreement between parties",
              "Requires offer, acceptance, consideration, and intent",
              "Governed by state statutes and the Uniform Commercial Code",
              "Subject to specific performance and damages remedies"
            ],
            relevance: "Medium relevance to property rights as it concerns agreements related to property",
            caseExamples: [
              "Lucy v. Zehmer (1954) - Established objective theory of contract formation",
              "Jacob & Youngs v. Kent (1921) - Addressed substantial performance in construction contracts"
            ],
            analysis: "Contract law would analyze your property question by examining any written or oral agreements between parties and whether they satisfy the requirements for a valid contract."
          }
        },
        recommendation: "Based on the analysis, your legal issue appears to be primarily governed by common law principles of property rights. However, any existing contracts between parties should be carefully reviewed as they may modify or supersede common law defaults."
      };
      
      setResults(mockResults);
      toast.success("Analysis complete!");
    } catch (error) {
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
                    <h4 className="text-lg font-medium mt-2">Relevant Cases</h4>
                    <ul className="list-disc list-inside">
                      {results.comparison.commonLaw.caseExamples.map((example: string, index: number) => (
                        <li key={index} className="text-sm">{example}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Contract Law Analysis</h3>
                    <p>{results.comparison.contractLaw.analysis}</p>
                    <h4 className="text-lg font-medium mt-2">Relevant Cases</h4>
                    <ul className="list-disc list-inside">
                      {results.comparison.contractLaw.caseExamples.map((example: string, index: number) => (
                        <li key={index} className="text-sm">{example}</li>
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
