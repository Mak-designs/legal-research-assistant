
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, BookOpen } from "lucide-react";
import ComparisonResults from "@/components/comparison/ComparisonResults";
import QueryForm from "@/components/comparison/QueryForm";
import DetailedAnalysisTab from "@/components/comparison/DetailedAnalysisTab";
import { useLegalSearch } from "@/hooks/use-legal-search";

interface ComparisonToolProps {
  initialQuery?: string | null;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ initialQuery = null }) => {
  const {
    query,
    setQuery,
    isLoading,
    results,
    jurisdiction,
    setJurisdiction,
    handleSearch
  } = useLegalSearch(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(new Event('submit') as unknown as React.FormEvent);
    }
  }, [initialQuery]);

  return (
    <div className="w-full space-y-6">
      <Card className="legal-card">
        <CardContent className="pt-6">
          <QueryForm
            query={query}
            setQuery={setQuery}
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            isLoading={isLoading}
            onSubmit={handleSearch}
          />
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
              <DetailedAnalysisTab results={results} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;
