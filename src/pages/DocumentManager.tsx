
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; 
import { DocumentVerification } from "@/components/library/DocumentVerification";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

const DocumentManager = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isMobile } = useDeviceType();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access document manager");
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
  }, [navigate]);

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
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Document Verification</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Verify and validate the integrity of legal documents
            </p>
          </div>
          
          <div className="w-full">
            <DocumentVerification />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentManager;
