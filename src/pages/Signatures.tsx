
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SignDocument } from "@/components/signature/SignDocument";
import { VerifySignature } from "@/components/signature/VerifySignature";
import { CertificateManager } from "@/components/signature/CertificateManager";
import { MultiPartySigningDashboard } from "@/components/signature/MultiPartySigningDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { FileSignature, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceType } from "@/hooks/use-mobile";

const Signatures = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isMobile, isTablet } = useDeviceType();
  
  // Mock document for demonstration
  const mockDocument = {
    id: 'doc-123',
    name: 'Smith v. Jones - Settlement Agreement',
    content: 'This settlement agreement made on April 22, 2025 between Smith and Jones...'
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access digital signatures");
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
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <FileSignature className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-primary" />
              Digital Signatures
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Securely sign, verify, and manage signatures for legal documents
            </p>
          </div>
          
          <Tabs defaultValue="sign" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
              <TabsTrigger value="sign">Sign</TabsTrigger>
              <TabsTrigger value="verify">Verify</TabsTrigger>
              <TabsTrigger value="multiparty">Multi-Party</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sign" className="space-y-4">
              <SignDocument 
                documentId={mockDocument.id}
                documentName={mockDocument.name}
                documentContent={mockDocument.content}
              />
            </TabsContent>
            
            <TabsContent value="verify" className="space-y-4">
              <VerifySignature
                documentId={mockDocument.id}
                documentName={mockDocument.name}
                documentContent={mockDocument.content}
              />
            </TabsContent>
            
            <TabsContent value="multiparty" className="space-y-4">
              <MultiPartySigningDashboard />
            </TabsContent>
            
            <TabsContent value="certificates" className="space-y-4">
              <CertificateManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signatures;
