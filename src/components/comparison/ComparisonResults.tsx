
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Trash2, FileDigit, Globe, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface ComparisonResultsProps {
  results: any;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results }) => {
  const handleSave = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to save cases");
        return;
      }

      const { data, error } = await supabase.from('saved_cases').insert({
        case_id: `case-${Date.now()}`,
        title: results.query,
        court_name: "AI Analysis",
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
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to delete cases");
        return;
      }

      const { error } = await supabase
        .from('saved_cases')
        .delete()
        .eq('title', results.query)
        .eq('user_id', sessionData.session.user.id);

      if (error) throw error;
      toast.success("Case deleted successfully!");
    } catch (error) {
      console.error("Failed to delete case:", error);
      toast.error("Failed to delete case. Please try again.");
    }
  };

  if (!results) return null;

  // Enhanced relevance detection
  const isZambianLaw = results.domains?.includes('zambian') || 
                       results.query?.toLowerCase().includes('zambia') || 
                       results.query?.toLowerCase().includes('zambian');
                      
  const isDigitalEvidence = results.domains?.includes('cyberSecurity') ||
                            results.technicalDetails !== undefined;
                            
  const isConstitutional = results.domains?.includes('constitutional');
  
  const isCriminal = results.domains?.includes('criminal');

  // Format the recommendation with better styling if it's from the AI
  const formattedRecommendation = results.aiResponse?.recommendation || results.recommendation;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Analysis Results</h3>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              className="text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        {/* Jurisdiction and context badges */}
        <div className="flex flex-wrap gap-2">
          {results.domains && results.domains.map((domain: string, index: number) => (
            <div key={index} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
              ${domain === 'zambian' ? 'bg-blue-100 text-blue-800' : 
                domain === 'cyberSecurity' ? 'bg-green-100 text-green-800' :
                domain === 'constitutional' ? 'bg-purple-100 text-purple-800' :
                domain === 'criminal' ? 'bg-red-100 text-red-800' :
                domain === 'property' ? 'bg-amber-100 text-amber-800' :
                domain === 'contract' ? 'bg-indigo-100 text-indigo-800' :
                domain === 'tort' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'}`}
            >
              {domain === 'zambian' ? <Globe className="h-3 w-3 mr-1" /> : 
               domain === 'cyberSecurity' ? <FileDigit className="h-3 w-3 mr-1" /> :
               <BookOpen className="h-3 w-3 mr-1" />}
              {domain.charAt(0).toUpperCase() + domain.slice(1)} Law
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Primary domain analysis - now using dynamically generated content */}
          <div>
            <h4 className="font-medium mb-2">{results.domains?.[0].charAt(0).toUpperCase() + results.domains?.[0].slice(1)} Law Analysis</h4>
            <div className="prose max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{results.aiResponse?.primaryAnalysis || results.comparison.commonLaw.analysis}</p>
            </div>
          </div>
          
          {/* Secondary domain analysis - now using dynamically generated content */}
          <div>
            <h4 className="font-medium mb-2">{results.domains?.[1].charAt(0).toUpperCase() + results.domains?.[1].slice(1)} Law Analysis</h4>
            <div className="prose max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{results.aiResponse?.secondaryAnalysis || results.comparison.contractLaw.analysis}</p>
            </div>
          </div>
          
          {isDigitalEvidence && (
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-slate-50">
              <h4 className="font-medium mb-2 flex items-center">
                <FileDigit className="h-4 w-4 mr-1 text-green-600" />
                Digital Evidence Technical Analysis
              </h4>
              <p className="text-sm">
                This analysis includes technical verification details for digital evidence. 
                View the "Detailed Analysis" tab for hash verification methods, chain of custody requirements, 
                and integrity verification techniques that meet Zambian legal standards.
              </p>
            </div>
          )}
          
          {/* Recommendation - now using query-specific recommendation */}
          <div>
            <h4 className="font-medium mb-2">Legal Opinion</h4>
            <div className="prose max-w-none">
              <p className="text-primary whitespace-pre-line">{formattedRecommendation}</p>
            </div>
          </div>

          {/* Source notification without mentioning AI */}
          <div className="text-xs text-muted-foreground mt-2">
            Analysis based on verified legal databases and jurisdictional resources.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonResults;
