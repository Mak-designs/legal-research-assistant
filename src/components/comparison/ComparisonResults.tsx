
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Info, Scale } from "lucide-react";

interface ComparisonResultsProps {
  results: any;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results }) => {
  if (!results) return null;

  const { commonLaw, contractLaw } = results.comparison;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Scale className="mr-2 h-5 w-5" />
            Common Law
            <Badge className="ml-2" variant="outline">
              {commonLaw.relevance.split(" ")[0]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Info className="mr-2 h-4 w-4 text-muted-foreground" />
              Key Principles
            </h4>
            <ul className="space-y-1">
              {commonLaw.principles.map((principle: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-primary mr-2">•</span> {principle}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              Key Cases
            </h4>
            <ul className="space-y-2">
              {commonLaw.caseExamples.map((example: string, index: number) => (
                <li key={index} className="text-sm italic">
                  {example}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              Analysis
            </h4>
            <p className="text-sm">{commonLaw.analysis}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-secondary">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Contract Law
            <Badge className="ml-2" variant="outline">
              {contractLaw.relevance.split(" ")[0]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Info className="mr-2 h-4 w-4 text-muted-foreground" />
              Key Principles
            </h4>
            <ul className="space-y-1">
              {contractLaw.principles.map((principle: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-secondary mr-2">•</span> {principle}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              Key Cases
            </h4>
            <ul className="space-y-2">
              {contractLaw.caseExamples.map((example: string, index: number) => (
                <li key={index} className="text-sm italic">
                  {example}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              Analysis
            </h4>
            <p className="text-sm">{contractLaw.analysis}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{results.recommendation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonResults;
