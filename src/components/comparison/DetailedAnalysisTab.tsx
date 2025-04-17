
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Book } from "lucide-react";

interface DetailedAnalysisTabProps {
  results: any;
}

const DetailedAnalysisTab: React.FC<DetailedAnalysisTabProps> = ({ results }) => {
  if (!results) return null;

  return (
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
  );
};

export default DetailedAnalysisTab;
