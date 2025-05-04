
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "@/components/library/DocumentUpload";
import { DocumentVerification } from "@/components/library/DocumentVerification";
import { supabase } from "@/integrations/supabase/client";

const DocumentManager = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
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
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Document Integrity Manager</h1>
            <p className="text-muted-foreground mt-1">
              Upload, verify, and manage legal documents with cryptographic integrity
            </p>
          </div>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Document Upload</TabsTrigger>
              <TabsTrigger value="verify">Document Verification</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <DocumentUpload />
            </TabsContent>
            <TabsContent value="verify">
              <DocumentVerification />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            @Mak_Designs
          </p>
          <p className="text-center text-sm text-muted-foreground">
            For educational purposes only. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DocumentManager;
