
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ActionButtonsProps {
  isMobile: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ isMobile }) => {
  const handleDownloadReport = () => {
    toast.success("Verification report downloaded");
  };
  
  const handleViewDiff = () => {
    toast.info("Complete diff would be displayed in a modal dialog");
  };
  
  const handleReportIssue = () => {
    toast.info("Issue reported to security team");
  };

  return (
    <div className={`${isMobile ? "flex-col space-y-2" : "flex-row space-x-2"}`}>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        onClick={handleReportIssue}
        className={isMobile ? "w-full" : ""}
      >
        <AlertTriangle className="h-4 w-4 mr-2" /> Report Issue
      </Button>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        onClick={handleViewDiff}
        className={isMobile ? "w-full" : ""}
      >
        <FileText className="h-4 w-4 mr-2" /> View Complete Diff
      </Button>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        onClick={handleDownloadReport}
        className={isMobile ? "w-full" : ""}
      >
        <Download className="h-4 w-4 mr-2" /> Download Report
      </Button>
    </div>
  );
};
