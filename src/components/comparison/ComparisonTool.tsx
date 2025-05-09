
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QueryForm from "./QueryForm";
import ComparisonResults from "./ComparisonResults";
import DetailedAnalysisTab from "./DetailedAnalysisTab";
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
    apiStatus,
    handleSearch
  } = useLegalSearch(initialQuery);

  return (
    <div className="space-y-6">
      <QueryForm
        query={query}
        setQuery={setQuery}
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        isLoading={isLoading}
        onSubmit={handleSearch}
      />
      
      {results && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ComparisonResults results={results} apiStatus={apiStatus} />
          </TabsContent>
          <TabsContent value="detailed">
            <DetailedAnalysisTab results={results} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ComparisonTool;
