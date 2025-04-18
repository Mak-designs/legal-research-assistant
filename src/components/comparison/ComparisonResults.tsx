
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
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

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Common Law</h4>
            <p className="text-muted-foreground">{results.comparison.commonLaw.analysis}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Contract Law</h4>
            <p className="text-muted-foreground">{results.comparison.contractLaw.analysis}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Recommendation</h4>
            <p className="text-primary">{results.recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonResults;
