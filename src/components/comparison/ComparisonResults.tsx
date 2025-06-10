import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Trash2, FileDigit, Globe, BookOpen, AlertTriangle, Brain } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ComparisonResultsProps {
  results: any;
  apiStatus?: "available" | "quota_exceeded" | "error" | null;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  results,
  apiStatus
}) => {
  const handleSave = async () => {
    try {
      const {
        data: sessionData
      } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to save cases");
        return;
      }
      const {
        data,
        error
      } = await supabase.from('saved_cases').insert({
        case_id: `case-${Date.now()}`,
        title: results.query,
        court_name: "Court Analysis",
        notes: JSON.stringify(results),
        user_id: sessionData.session.user.id,
        decision_date: new Date().toISOString()
      }).select();
      if (error) throw error;
      toast.success("Case saved successfully!");
    } catch (error) {
      console.error("Failed to save case:", error);
      toast.error("Failed to save case. Please try again.");
    }
  };
  const handleDelete = async () => {
    try {
      const {
        data: sessionData
      } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to delete cases");
        return;
      }
      const {
        error
      } = await supabase.from('saved_cases').delete().eq('title', results.query).eq('user_id', sessionData.session.user.id);
      if (error) throw error;
      toast.success("Case deleted successfully!");
    } catch (error) {
      console.error("Failed to delete case:", error);
      toast.error("Failed to delete case. Please try again.");
    }
  };

  if (!results) return null;

  // Check if we have AI-generated analysis
  const hasAIAnalysis = results.aiResponse && !results.aiResponse.error;
  const hasAuthError = results.aiResponse?.error === "authentication_failed";
  const hasInLegalBERTEnhancement = results.semanticAnalysis && results.dataSource === "huggingface_inlegalbert";

  // Enhanced relevance detection
  const isZambianLaw = results.domains?.includes('zambian') || results.query?.toLowerCase().includes('zambia') || results.query?.toLowerCase().includes('zambian');
  const isDigitalEvidence = results.domains?.includes('cyberSecurity') || results.technicalDetails !== undefined;
  const isConstitutional = results.domains?.includes('constitutional');
  const isCriminal = results.domains?.includes('criminal');

  // Format the recommendation with better styling if it's from the AI
  const formattedRecommendation = hasAIAnalysis ? results.aiResponse.recommendation : results.recommendation;

  // Format domain names for display
  const getDomainDisplayName = (domain: string) => {
    const domainMap: Record<string, string> = {
      'contract': 'Contract Law',
      'property': 'Property Law',
      'tort': 'Tort Law',
      'constitutional': 'Constitutional Law',
      'criminal': 'Criminal Law',
      'zambian': 'Zambian Law',
      'cyberSecurity': 'Cyber Security Law'
    };
    return domainMap[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
  };

  // Get the primary and secondary analysis - prefer AI over fallback
  const primaryAnalysis = hasAIAnalysis ? 
    results.aiResponse.primaryAnalysis : 
    results.comparison.commonLaw.analysis;
    
  const secondaryAnalysis = hasAIAnalysis ? 
    results.aiResponse.secondaryAnalysis : 
    results.comparison.contractLaw.analysis;

  return <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-4">
        {hasAuthError && <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              AI analysis is currently unavailable due to authentication issues. Please check the Hugging Face API configuration. 
              You're viewing standard legal analysis instead.
            </AlertDescription>
          </Alert>}

        {apiStatus === "quota_exceeded" && <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              AI-powered analysis is currently limited due to API usage quotas. You're viewing our standard analysis instead. 
              For detailed analysis, please try again later.
            </AlertDescription>
          </Alert>}

        {hasInLegalBERTEnhancement && <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <Brain className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              ✨ <strong>InLegalBERT Enhanced Analysis</strong> - This analysis uses specialized legal AI trained on 5.4M Indian legal documents 
              for superior legal text understanding and relevance scoring.
              <div className="mt-2 text-sm">
                <strong>Detected Domain:</strong> {results.semanticAnalysis?.inLegalBERTDomain} 
                <span className="ml-2 text-purple-600">
                  (Confidence: {(results.semanticAnalysis?.confidence * 100).toFixed(1)}%)
                </span>
              </div>
            </AlertDescription>
          </Alert>}

        {hasAIAnalysis && !hasInLegalBERTEnhancement && <Alert className="bg-green-50 border-green-200">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✨ This analysis was generated using advanced AI to provide personalized insights for your specific query.
            </AlertDescription>
          </Alert>}

        {/* Case header with query as title */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">{results.query}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="text-sm text-gray-500">
              {hasInLegalBERTEnhancement ? "InLegalBERT Enhanced AI Analysis" : 
               hasAIAnalysis ? "AI-Powered Legal Analysis" : "Court Analysis"}
            </div>
            <div className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</div>
            {hasInLegalBERTEnhancement && (
              <div className="text-sm text-purple-600 font-medium">
                Semantic Relevance Scoring Applied
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Legal Analysis</h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="text-green-600 hover:text-green-700">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        {/* Domain badges with InLegalBERT enhancement indicator */}
        <div className="flex flex-wrap gap-2">
          {results.domains && results.domains.map((domain: string, index: number) => 
            <div key={index} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
              ${hasInLegalBERTEnhancement ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                domain === 'zambian' ? 'bg-blue-100 text-blue-800' : 
                domain === 'cyberSecurity' ? 'bg-green-100 text-green-800' : 
                domain === 'constitutional' ? 'bg-purple-100 text-purple-800' : 
                domain === 'criminal' ? 'bg-red-100 text-red-800' : 
                domain === 'property' ? 'bg-amber-100 text-amber-800' : 
                domain === 'contract' ? 'bg-indigo-100 text-indigo-800' : 
                domain === 'tort' ? 'bg-orange-100 text-orange-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {hasInLegalBERTEnhancement ? <Brain className="h-3 w-3 mr-1" /> :
               domain === 'zambian' ? <Globe className="h-3 w-3 mr-1" /> : 
               domain === 'cyberSecurity' ? <FileDigit className="h-3 w-3 mr-1" /> : 
               <BookOpen className="h-3 w-3 mr-1" />}
              {getDomainDisplayName(domain)}
              {hasInLegalBERTEnhancement && <span className="ml-1 text-xs">AI+</span>}
            </div>
          )}
          {hasInLegalBERTEnhancement && results.semanticAnalysis?.inLegalBERTDomain && (
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-300">
              <Brain className="h-3 w-3 mr-1" />
              InLegalBERT: {results.semanticAnalysis.inLegalBERTDomain}
            </div>
          )}
        </div>

        {/* InLegalBERT Semantic Analysis */}
        {hasInLegalBERTEnhancement && results.semanticAnalysis?.semanticSegments && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-lg mb-2 flex items-center text-purple-800">
              <Brain className="h-4 w-4 mr-2" />
              InLegalBERT Semantic Analysis
            </h4>
            <div className="text-sm text-purple-700">
              <div className="mb-2">
                <strong>Identified Segments:</strong>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {results.semanticAnalysis.semanticSegments.map((segment: string, index: number) => (
                  <li key={index} className="text-purple-600">{segment}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Primary domain analysis */}
          <div className={`border rounded-lg p-5 ${
            hasInLegalBERTEnhancement ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200' :
            hasAIAnalysis ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="font-medium text-lg mb-3 flex items-center">
              {hasInLegalBERTEnhancement && <Brain className="text-purple-600 mr-2 h-4 w-4" />}
              {hasAIAnalysis && !hasInLegalBERTEnhancement && <span className="text-blue-600 mr-2">🤖</span>}
              {getDomainDisplayName(results.domains?.[0])} Analysis
              {hasInLegalBERTEnhancement && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Enhanced</span>}
            </h4>
            <div className="prose max-w-none">
              <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                {primaryAnalysis}
              </p>
            </div>
          </div>
          
          {/* Secondary domain analysis */}
          <div className={`border rounded-lg p-5 ${
            hasInLegalBERTEnhancement ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
            hasAIAnalysis ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
          }`}>
            <h4 className="font-medium text-lg mb-3 flex items-center">
              {hasInLegalBERTEnhancement && <Brain className="text-green-600 mr-2 h-4 w-4" />}
              {hasAIAnalysis && !hasInLegalBERTEnhancement && <span className="text-green-600 mr-2">🤖</span>}
              {getDomainDisplayName(results.domains?.[1])} Perspective
              {hasInLegalBERTEnhancement && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Enhanced</span>}
            </h4>
            <div className="prose max-w-none">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {secondaryAnalysis}
              </p>
            </div>
          </div>

          {/* AI Recommendation section */}
          {hasAIAnalysis && formattedRecommendation && (
            <div className={`border-l-4 pl-4 py-2 ${
              hasInLegalBERTEnhancement ? 'border-purple-500 bg-purple-50' : 'border-blue-500 bg-blue-50'
            }`}>
              <h4 className="font-medium mb-2 flex items-center">
                {hasInLegalBERTEnhancement ? 
                  <Brain className="text-purple-600 mr-2 h-4 w-4" /> :
                  <span className="text-blue-600 mr-2">💡</span>
                }
                {hasInLegalBERTEnhancement ? "InLegalBERT Enhanced Recommendation" : "AI Legal Recommendation"}
              </h4>
              <p className={`text-sm leading-relaxed ${
                hasInLegalBERTEnhancement ? 'text-purple-800' : 'text-blue-800'
              }`}>
                {formattedRecommendation}
              </p>
            </div>
          )}
          
          {isDigitalEvidence && <div className="border-l-4 border-green-500 pl-4 py-2 bg-slate-50">
              <h4 className="font-medium mb-2 flex items-center">
                <FileDigit className="h-4 w-4 mr-1 text-green-600" />
                Digital Evidence Technical Analysis
              </h4>
              <p className="text-sm">
                This analysis includes technical verification details for digital evidence. 
                View the "Detailed Analysis" tab for hash verification methods, chain of custody requirements, 
                and integrity verification techniques that meet legal standards.
              </p>
            </div>}
        </div>
      </CardContent>
    </Card>;
};

export default ComparisonResults;
