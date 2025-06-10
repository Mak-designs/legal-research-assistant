
import React from "react";
import QueryForm from "./QueryForm";
import ConversationalResults from "./ConversationalResults";
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
        <ConversationalResults results={results} apiStatus={apiStatus} />
      )}
    </div>
  );
};

export default ComparisonTool;
