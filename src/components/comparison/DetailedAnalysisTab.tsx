
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Book, Shield, FileDigit, History, Scale, Gavel, Landmark, Globe } from "lucide-react";

interface DetailedAnalysisTabProps {
  results: any;
}

const DetailedAnalysisTab: React.FC<DetailedAnalysisTabProps> = ({
  results
}) => {
  if (!results) return null;

  // Determine domain display names
  const domainDisplayNames = {
    property: "Property Law",
    contract: "Contract Law",
    tort: "Tort Law",
    constitutional: "Constitutional Law",
    criminal: "Criminal Law",
    zambian: "Zambian Law",
    cyberSecurity: "Cyber Security & Digital Evidence"
  };
  
  const primaryDomainName = domainDisplayNames[results.domains?.[0]] || results.domains?.[0];
  const secondaryDomainName = domainDisplayNames[results.domains?.[1]] || results.domains?.[1];

  // Choose appropriate icons for domains
  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'property':
        return <Landmark className="mr-2 h-5 w-5 text-amber-600" />;
      case 'contract':
        return <Scale className="mr-2 h-5 w-5 text-indigo-600" />;
      case 'tort':
        return <Shield className="mr-2 h-5 w-5 text-orange-600" />;
      case 'constitutional':
        return <Landmark className="mr-2 h-5 w-5 text-purple-600" />;
      case 'criminal':
        return <Gavel className="mr-2 h-5 w-5 text-red-600" />;
      case 'zambian':
        return <Globe className="mr-2 h-5 w-5 text-blue-600" />;
      case 'cyberSecurity':
        return <FileDigit className="mr-2 h-5 w-5 text-green-600" />;
      default:
        return <BookOpen className="mr-2 h-5 w-5 text-primary" />;
    }
  };

  // Use AI analysis if available, otherwise fall back to the default analysis
  const primaryAnalysis = results.aiResponse?.primaryAnalysis || results.comparison?.commonLaw?.analysis;
  const secondaryAnalysis = results.aiResponse?.secondaryAnalysis || results.comparison?.contractLaw?.analysis;
  
  // Safe access to comparison data with fallbacks
  const primaryComparison = results.comparison?.commonLaw;
  const secondaryComparison = results.comparison?.contractLaw;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Query</h3>
          <p className="text-muted-foreground">{results.query}</p>
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
                {results.technicalDetails.hashingTechniques?.map((technique, index) => (
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
                    {results.technicalDetails.chainOfCustody?.map((step, index) => (
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
        
        {/* Primary Domain Analysis */}
        {primaryAnalysis && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold flex items-center">
              {getDomainIcon(results.domains?.[0])}
              {primaryDomainName} Analysis
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{primaryAnalysis}</p>
            </div>
            
            {primaryComparison?.principles && (
              <>
                <h4 className="text-lg font-medium mt-2">Key Principles</h4>
                <ul className="list-disc list-inside space-y-1">
                  {primaryComparison.principles.map((principle: string, index: number) => (
                    <li key={index} className="text-sm">{principle}</li>
                  )).slice(0, 4)}
                </ul>
              </>
            )}
            
            {primaryComparison?.caseExamples && (
              <>
                <h4 className="text-lg font-medium mt-3 flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  Relevant Cases
                </h4>
                <ul className="list-disc list-inside space-y-1.5">
                  {primaryComparison.caseExamples.map((example: string, index: number) => (
                    <li key={index} className="text-sm">{example}</li>
                  ))}
                </ul>
              </>
            )}
            
            {primaryComparison?.statutes && (
              <>
                <h4 className="text-lg font-medium mt-3 flex items-center">
                  <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                  Relevant Statutes
                </h4>
                <ul className="list-disc list-inside space-y-1.5">
                  {primaryComparison.statutes.map((statute: string, index: number) => (
                    <li key={index} className="text-sm">{statute}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        
        {/* Secondary Domain Analysis - only show if exists and is different */}
        {secondaryAnalysis && results.domains?.[1] && results.domains[1] !== results.domains[0] && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold flex items-center">
              {getDomainIcon(results.domains?.[1])}
              {secondaryDomainName} Analysis
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{secondaryAnalysis}</p>
            </div>
            
            {secondaryComparison?.principles && (
              <>
                <h4 className="text-lg font-medium mt-2">Key Principles</h4>
                <ul className="list-disc list-inside space-y-1">
                  {secondaryComparison.principles.map((principle: string, index: number) => (
                    <li key={index} className="text-sm">{principle}</li>
                  )).slice(0, 4)}
                </ul>
              </>
            )}
            
            {secondaryComparison?.caseExamples && (
              <>
                <h4 className="text-lg font-medium mt-3 flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  Relevant Cases
                </h4>
                <ul className="list-disc list-inside space-y-1.5">
                  {secondaryComparison.caseExamples.map((example: string, index: number) => (
                    <li key={index} className="text-sm">{example}</li>
                  ))}
                </ul>
              </>
            )}
            
            {secondaryComparison?.statutes && (
              <>
                <h4 className="text-lg font-medium mt-3 flex items-center">
                  <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                  Relevant Statutes
                </h4>
                <ul className="list-disc list-inside space-y-1.5">
                  {secondaryComparison.statutes.map((statute: string, index: number) => (
                    <li key={index} className="text-sm">{statute}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailedAnalysisTab;
