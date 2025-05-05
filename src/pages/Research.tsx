
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonTool from "@/components/comparison/ComparisonTool";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Scale, Loader2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useDeviceType } from "@/hooks/use-mobile";

const Research = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);
  const { isMobile, isTablet } = useDeviceType();
  
  useEffect(() => {
    if (location.state && location.state.initialQuery) {
      setInitialQuery(location.state.initialQuery);
    }
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access research tools");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login");
        toast.error("Authentication error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          navigate("/login");
        } else if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      navigate("/");
      toast.success("You have been logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-center text-sm sm:text-base">Verifying authentication...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="flex-1 container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                <Scale className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-primary" />
                Legal Research
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Research and compare legal principles
              </p>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={() => navigate("/library")}
                className="text-xs sm:text-sm"
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Your Library
              </Button>
            </div>
          </div>
          
          <Card className="shadow-sm">
            <CardContent className={`${isMobile ? 'p-3 sm:pt-4' : 'pt-6'}`}>
              <ComparisonTool initialQuery={initialQuery} />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Research;
