
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; 
import { DocumentVerification } from "@/components/library/DocumentVerification";
import { DocumentAuditTrail } from "@/components/blockchain/DocumentAuditTrail";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Loader2, FileCheck, Shield } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const DocumentManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isMobile } = useDeviceType();
  
  // Get selected case from location state if available
  const selectedCase = location.state?.selectedCase || null;
  
  // Get document ID and name from URL query parameters if available
  const searchParams = new URLSearchParams(location.search);
  const documentId = searchParams.get('documentId') || selectedCase?.case_id || 'SMITH2025-BRIEF-01';
  const documentName = searchParams.get('documentName') || selectedCase?.title || 'Smith v. Jones - Case Brief';
  
  // Set active tab based on query parameters
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') === 'audit-trail' ? 'audit-trail' : 'verification');
  
  useEffect(() => {
    // Update active tab when URL search parameters change
    const tabParam = searchParams.get('tab');
    if (tabParam === 'audit-trail') {
      setActiveTab('audit-trail');
    }
  }, [location.search]);
  
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-primary" />
                Document Manager
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Verify, audit, and manage legal documents
              </p>
            </div>
            
            <div className="flex items-center mt-2 md:mt-0">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => navigate("/blockchain-audit")}
                className="text-xs sm:text-sm"
              >
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Blockchain Audit
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="verification">Document Verification</TabsTrigger>
              <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="verification" className="space-y-4">
              <DocumentVerification selectedCase={selectedCase} />
            </TabsContent>
            
            <TabsContent value="audit-trail" className="space-y-4">
              <DocumentAuditTrail 
                documentId={documentId}
                documentName={documentName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentManager;
