
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, FileDigit, Library, Scale, Search as SearchIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const ExternalLinks = () => {
  const isMobile = useIsMobile();
  
  const links = [
    {
      name: "Cornell Law",
      href: "https://www.law.cornell.edu/",
      icon: <Scale className="h-4 w-4 mr-1" />
    },
    {
      name: "Court Listener",
      href: "https://www.courtlistener.com/",
      icon: <GraduationCap className="h-4 w-4 mr-1" />
    },
    {
      name: "Zambian Law",
      href: "https://zambialii.org/",
      icon: <ExternalLink className="h-4 w-4 mr-1" />
    },
    {
      name: "Research Tool",
      href: "/research",
      icon: <SearchIcon className="h-4 w-4 mr-1" />,
      internal: true
    },
    {
      name: "Legal Library",
      href: "/library",
      icon: <Library className="h-4 w-4 mr-1" />,
      internal: true
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
        {links.map((link) => (
          link.internal ? (
            <Button 
              key={link.name} 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              asChild
              className="text-xs sm:text-sm justify-start sm:justify-center"
            >
              <Link to={link.href} className="flex items-center">
                {link.icon}
                <span className={isMobile ? "text-xs" : ""}>{link.name}</span>
              </Link>
            </Button>
          ) : (
            <Button 
              key={link.name} 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              asChild
              className="text-xs sm:text-sm justify-start sm:justify-center"
            >
              <a href={link.href} target="_blank" rel="noreferrer" className="flex items-center">
                {link.icon}
                <span className={isMobile ? "text-xs" : ""}>{link.name}</span>
              </a>
            </Button>
          )
        ))}
      </div>
    </div>
  );
};
