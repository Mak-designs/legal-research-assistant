
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, FileText } from "lucide-react";
import { RecommendationsTables } from './RecommendationsTables';
import { Separator } from "@/components/ui/separator";

export const ExternalLinks = () => {
  const [showRecommendations, setShowRecommendations] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild>
          <a href="https://www.law.cornell.edu/" target="_blank" rel="noreferrer" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            Cornell Law
          </a>
        </Button>
        
        <Button variant="outline" size="sm" asChild>
          <a href="https://www.courtlistener.com/" target="_blank" rel="noreferrer" className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-1" />
            Court Listener
          </a>
        </Button>
        
        <Button variant="outline" size="sm" asChild>
          <a href="https://zambialii.org/" target="_blank" rel="noreferrer" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            Zambian Law
          </a>
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => setShowRecommendations(!showRecommendations)} className="flex items-center">
          <FileText className="h-4 w-4 mr-1" />
          {showRecommendations ? "Hide Recommendations" : "Show Recommendations"}
        </Button>
      </div>
      
      {showRecommendations && (
        <>
          <Separator className="my-4" />
          <RecommendationsTables />
        </>
      )}
    </div>
  );
};
