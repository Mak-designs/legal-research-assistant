
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
        <p className="text-center text-sm text-muted-foreground">
          @Mak_Designs
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <a href="/about" className="hover:underline underline-offset-4">
            About
          </a>
          <a href="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </a>
          <a href="/terms" className="hover:underline underline-offset-4">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
