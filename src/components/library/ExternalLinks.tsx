
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, FileDigit } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const ExternalLinks = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button variant="outline" size={isMobile ? "sm" : "default"} asChild>
          <a href="https://www.law.cornell.edu/" target="_blank" rel="noreferrer" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            Cornell Law
          </a>
        </Button>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} asChild>
          <a href="https://www.courtlistener.com/" target="_blank" rel="noreferrer" className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-1" />
            Court Listener
          </a>
        </Button>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} asChild>
          <a href="https://zambialii.org/" target="_blank" rel="noreferrer" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            Zambian Law
          </a>
        </Button>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} asChild>
          <Link to="/documents" className="flex items-center">
            <FileDigit className="h-4 w-4 mr-1" />
            Document Manager
          </Link>
        </Button>
      </div>
    </div>
  );
};
