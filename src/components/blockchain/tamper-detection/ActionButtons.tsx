import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
interface ActionButtonsProps {
  isMobile: boolean;
}
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isMobile
}) => {
  const handleDownloadReport = () => {
    toast.success("Verification report downloaded");
  };
  const handleViewDiff = () => {
    toast.info("Complete diff would be displayed in a modal dialog");
  };
  const handleReportIssue = () => {
    toast.info("Issue reported to security team");
  };
  return <div className={`${isMobile ? "flex-col space-y-2" : "flex-row space-x-2"}`}>
      
      
      
    </div>;
};