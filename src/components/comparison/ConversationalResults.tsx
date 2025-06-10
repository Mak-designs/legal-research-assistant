import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Globe, AlertTriangle, MessageCircle } from "lucide-react";
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
      toast.success("Analysis deleted successfully!");
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      toast.error("Failed to delete analysis. Please try again.");
    }
  };
  if (!results) return null;

  // Check if we have AI-generated analysis
  const hasAIAnalysis = results.aiResponse && !results.aiResponse.error;
  const hasAuthError = results.aiResponse?.error === "authentication_failed";
  return <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-6">
        {hasAuthError && <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              AI analysis is currently unavailable due to authentication issues. Please check the configuration. 
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

        {hasAIAnalysis && <Alert className="bg-green-50 border-green-200">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✨ This analysis was generated using advanced AI to provide personalized insights for your Zambian legal query.
            </AlertDescription>
          </Alert>}

        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{results.query}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Zambian Legal Analysis
                </div>
                <div>Date: {new Date().toLocaleDateString()}</div>
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

        {/* Conversational Analysis */}
        <div className="prose max-w-none">
          {hasAIAnalysis ? <div className="space-y-6">
              {/* Primary Analysis */}
              {results.aiResponse.primaryAnalysis && <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {results.aiResponse.primaryAnalysis}
                  </div>
                </div>}

              {/* Secondary Analysis */}
              {results.aiResponse.secondaryAnalysis && <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {results.aiResponse.secondaryAnalysis}
                  </div>
                </div>}

              {/* AI Recommendation */}
              {results.aiResponse.recommendation && <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                  <h4 className="font-medium mb-3 flex items-center text-amber-800">
                    💡 Legal Recommendation
                  </h4>
                  <div className="text-amber-900 leading-relaxed">
                    {results.aiResponse.recommendation}
                  </div>
                </div>}
            </div> : <div className="space-y-6">
              {/* Fallback conversational format */}
              <div className="bg-slate-50 border-l-4 border-slate-400 p-6 rounded-r-lg">
                <div className="text-slate-800 leading-relaxed">
                  {results.comparison?.commonLaw?.analysis || "Analysis based on Zambian legal precedents and current legal standards."}
                </div>
              </div>
              
              {results.comparison?.contractLaw?.analysis && <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                  <div className="text-gray-800 leading-relaxed">
                    {results.comparison.contractLaw.analysis}
                  </div>
                </div>}

              {results.recommendation}
            </div>}
        </div>

        {/* Technical Details for Digital Evidence */}
        {results.technicalDetails && <div className="border-t pt-6">
            <h4 className="font-medium mb-4 text-green-700">Digital Evidence Technical Requirements</h4>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800 leading-relaxed">
                {results.technicalDetails.integrityVerification}
              </p>
            </div>
          </div>}
      </CardContent>
    </Card>;
};
export default ConversationalResults;