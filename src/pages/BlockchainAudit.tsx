import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SystemAuditDashboard } from "@/components/blockchain/SystemAuditDashboard";
import { DocumentAuditTrail } from "@/components/blockchain/DocumentAuditTrail";
import { AuditCertificate } from "@/components/blockchain/AuditCertificate";
import { DocumentTamperDetection } from "@/components/blockchain/DocumentTamperDetection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Loader2, Shield, FileCheck, FileText, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceType } from "@/hooks/use-mobile";
const BlockchainAudit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    isMobile,
    isTablet
  } = useDeviceType();
  const [activeTab, setActiveTab] = useState<string>("system");

  // Parse query parameters for document information
  const searchParams = new URLSearchParams(location.search);
  const documentId = searchParams.get('documentId');
  const documentName = searchParams.get('documentName');

  // Mock document for demonstration (use query params if available)
  const mockDocument = {
    id: documentId || 'SMITH2025-BRIEF-01',
    name: documentName || 'Smith v. Jones - Case Brief',
    content: 'This case brief outlines the claims brought by Smith against Jones...'
  };

  // Set active tab based on query parameters
  useEffect(() => {
    if (documentId && documentName) {
      setActiveTab('document');
    }
  }, [documentId, documentName]);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access blockchain audit tools");
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
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate("/login");
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      }
    });
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
    return <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-center text-sm sm:text-base">Verifying authentication...</span>
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="flex-1 container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-primary" />
              Blockchain Audit Trails
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Cryptographically secured audit logs for legal documents
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              
              <TabsTrigger value="document">Document Trail</TabsTrigger>
              <TabsTrigger value="certificate" className="px-[90px] mx-[34px]">Generate Certificate</TabsTrigger>
              <TabsTrigger value="tamper" className="px-[3px] mx-[220px]">Tamper Detection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-4">
              <SystemAuditDashboard />
            </TabsContent>
            
            <TabsContent value="document" className="space-y-4">
              <DocumentAuditTrail documentId={mockDocument.id} documentName={mockDocument.name} />
            </TabsContent>
            
            <TabsContent value="certificate" className="space-y-4">
              <AuditCertificate documentId={mockDocument.id} documentName={mockDocument.name} documentContent={mockDocument.content} />
            </TabsContent>
            
            <TabsContent value="tamper" className="space-y-4">
              <DocumentTamperDetection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default BlockchainAudit;