
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col gap-4 sm:flex-row sm:gap-2 py-6 w-full items-center justify-between">
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          @Mak_Designs
        </p>
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <Link to="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          <Link to="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link to="/terms" className="hover:underline underline-offset-4">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
