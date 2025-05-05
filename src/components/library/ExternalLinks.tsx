
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, FileDigit } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const ExternalLinks = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="w-full xs:w-auto text-xs sm:text-sm" 
          asChild
        >
          <a href="https://www.law.cornell.edu/" target="_blank" rel="noreferrer" className="flex items-center justify-center">
            <ExternalLink className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4" />
            Cornell Law
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="w-full xs:w-auto text-xs sm:text-sm" 
          asChild
        >
          <a href="https://www.courtlistener.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center">
            <GraduationCap className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4" />
            Court Listener
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="w-full xs:w-auto text-xs sm:text-sm" 
          asChild
        >
          <a href="https://zambialii.org/" target="_blank" rel="noreferrer" className="flex items-center justify-center">
            <ExternalLink className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4" />
            Zambian Law
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="w-full xs:w-auto text-xs sm:text-sm" 
          asChild
        >
          <Link to="/documents" className="flex items-center justify-center">
            <FileDigit className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4" />
            Document Manager
          </Link>
        </Button>
      </div>
    </div>
  );
};
