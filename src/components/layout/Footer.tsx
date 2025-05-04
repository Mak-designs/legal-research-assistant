
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const isMobile = useIsMobile();
  
  const links = [
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" }
  ];
  
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col gap-2 sm:flex-row py-4 sm:py-6 w-full items-center justify-between">
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          @Mak_Designs
        </p>
        <nav className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          {links.map(link => (
            <Link 
              key={link.name}
              to={link.href} 
              className="hover:underline underline-offset-4"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
