
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ComparisonTool from "@/components/comparison/ComparisonTool";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ExternalLink, Scale } from "lucide-react";

const Research = () => {
  const navigate = useNavigate();
  // In a real app, we would check for actual authentication
  // For demo purposes, we'll simulate an authenticated state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is authenticated
    // For demo purposes, we'll set it to true to simulate being logged in
    const checkAuth = async () => {
      // Simulate checking authentication
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAuthenticated(true);
      
      // Uncomment the below code to simulate an unauthenticated user
      // setIsAuthenticated(false);
      // navigate("/login");
      // toast.error("Please sign in to access research tools");
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = () => {
    // Simulate logout
    setIsAuthenticated(false);
    navigate("/");
    toast.success("You have been logged out");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Scale className="h-8 w-8 mr-2 text-primary" />
                Legal Research Assistant
              </h1>
              <p className="text-muted-foreground mt-1">
                Compare common law and contract law using our NLP analysis tool
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href="#" target="_blank" rel="noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Legal Resources
                </a>
              </Button>
            </div>
          </div>
          
          <ComparisonTool />
        </div>
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 LegalAssist. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            For educational purposes only. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Research;
