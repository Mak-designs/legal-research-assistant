
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { DocumentVerification } from "@/components/library/DocumentVerification";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const DocumentManager = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }
      
      setIsAuthenticated(true);
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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="flex-1 container py-4 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Document Verification</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Verify and validate the integrity of legal documents with cryptographic fingerprinting
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
