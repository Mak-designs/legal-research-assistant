
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Book, Shield, FileDigit, History } from "lucide-react";

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
        
        {/* Display technical details for digital evidence if available */}
        {results.technicalDetails && (
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
            <h3 className="text-xl font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Technical Verification Details
            </h3>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium flex items-center">
                <FileDigit className="mr-2 h-4 w-4 text-muted-foreground" />
                Hashing Techniques
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {results.technicalDetails.hashingTechniques.map((technique, index) => (
                  <div key={index} className="border p-2 rounded bg-white">
                    <p className="font-medium">{technique.algorithm}</p>
                    <p className="text-sm text-muted-foreground">{technique.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium flex items-center">
                <History className="mr-2 h-4 w-4 text-muted-foreground" />
                Chain of Custody Requirements
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-4 py-2 text-left">Step</th>
                      <th className="border px-4 py-2 text-left">Requirements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.technicalDetails.chainOfCustody.map((step, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="border px-4 py-2">{step.step}</td>
                        <td className="border px-4 py-2">{step.requirements}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Integrity Verification Example</h4>
              <div className="bg-black text-white p-3 rounded-md overflow-x-auto font-mono text-sm">
                {results.technicalDetails.integrityVerification}
              </div>
            </div>
          </div>
        )}
        
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
