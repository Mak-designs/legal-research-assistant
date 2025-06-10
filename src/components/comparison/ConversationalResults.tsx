
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Globe, AlertTriangle, MessageCircle, Scale, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConversationalResultsProps {
  results: any;
  apiStatus?: "available" | "quota_exceeded" | "error" | null;
}

const ConversationalResults: React.FC<ConversationalResultsProps> = ({
  results,
  apiStatus
}) => {
  const handleSave = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to save analyses");
        return;
      }
      
      const { data, error } = await supabase.from('saved_cases').insert({
        case_id: `zambian-analysis-${Date.now()}`,
        title: results.query,
        court_name: "Zambian Legal Analysis",
        notes: JSON.stringify(results),
        user_id: sessionData.session.user.id,
        decision_date: new Date().toISOString()
      }).select();
      
      if (error) throw error;
      toast.success("Analysis saved successfully!");
    } catch (error) {
      console.error("Failed to save analysis:", error);
      toast.error("Failed to save analysis. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to delete analyses");
        return;
      }
      
      const { error } = await supabase.from('saved_cases')
        .delete()
        .eq('title', results.query)
        .eq('user_id', sessionData.session.user.id);
      
      if (error) throw error;
      toast.success("Analysis deleted successfully!");
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      toast.error("Failed to delete analysis. Please try again.");
    }
  };

  if (!results) return null;

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-6">
        {apiStatus === "quota_exceeded" && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              AI-powered analysis is currently limited due to API usage quotas. You're viewing our standard analysis instead.
            </AlertDescription>
          </Alert>
        )}

        {apiStatus === "available" && (
          <Alert className="bg-green-50 border-green-200">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✨ This analysis was generated using advanced legal research on Zambian law.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Scale className="h-5 w-5 mr-2 text-primary" />
                {results.query}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Zambian Legal Analysis
                </div>
                <div>Date: {new Date().toLocaleDateString()}</div>
                {results.totalFound && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {results.totalFound.cases} cases, {results.totalFound.statutes} statutes
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
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
        </div>

        {/* Main Analysis */}
        <div className="prose max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {results.analysis}
            </div>
          </div>
        </div>

        {/* Relevant Cases Section */}
        {results.zambianCases && results.zambianCases.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4 text-blue-700 flex items-center">
              <Scale className="h-4 w-4 mr-2" />
              Relevant Zambian Cases
            </h4>
            <div className="space-y-4">
              {results.zambianCases.slice(0, 3).map((caseItem: any, index: number) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-300">
                  <h5 className="font-medium text-blue-900">{caseItem.title}</h5>
                  <p className="text-sm text-blue-700 mt-1">{caseItem.citation}</p>
                  <p className="text-sm text-blue-800 mt-2">{caseItem.case_summary}</p>
                  {caseItem.legal_principles && caseItem.legal_principles.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-blue-700">Legal Principles: </span>
                      <span className="text-xs text-blue-600">{caseItem.legal_principles.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relevant Statutes Section */}
        {results.zambianStatutes && results.zambianStatutes.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4 text-green-700 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Relevant Zambian Legislation
            </h4>
            <div className="space-y-4">
              {results.zambianStatutes.slice(0, 3).map((statute: any, index: number) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-300">
                  <h5 className="font-medium text-green-900">{statute.title}</h5>
                  <p className="text-sm text-green-700 mt-1">{statute.citation}</p>
                  {statute.section_number && (
                    <p className="text-sm text-green-700">Section: {statute.section_number}</p>
                  )}
                  <p className="text-sm text-green-800 mt-2">{statute.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationalResults;
