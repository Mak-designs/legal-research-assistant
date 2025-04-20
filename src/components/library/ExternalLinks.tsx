
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap } from "lucide-react";

export const ExternalLinks = () => {
  return (
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
    </div>
  );
};

