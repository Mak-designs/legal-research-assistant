
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { ShieldCheck, ShieldX, Search, History } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { recordDocumentEvent } from "@/utils/blockchainUtil";
import { supabase } from "@/integrations/supabase/client";

export const DocumentVerification = ({ selectedCase = null }) => {
  const [file, setFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'modified' | null;
    originalHash?: string;
    currentHash?: string;
    lastVerified?: string;
    documentId?: string;
    documentName?: string;
  }>({ status: null });
  const { isMobile } = useDeviceType();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Get current user email on component mount
  React.useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setUserEmail(session.user.email || null);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };
    
    fetchUserEmail();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult({ status: null });
    }
  };

  const verifyDocument = async () => {
    if (!file) {
      toast.error("No file selected. Please select a document to verify.");
      return;
    }

    try {
      // In a real implementation, you'd send the file to your backend for verification
      // against stored hash values. Here we're simulating the verification process
      const arrayBuffer = await file.arrayBuffer();
      const hashArray = new Uint8Array(await crypto.subtle.digest('SHA-256', arrayBuffer));
      const currentHash = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Simulate checking against stored hash
      // In a real app, you would look up the hash from your database
      const simulatedStoredHash = Math.random() > 0.3 ? currentHash : 'differenthash123456789';
      
      const status = currentHash === simulatedStoredHash ? 'verified' : 'modified';
      
      // Generate document ID and name
      const documentId = selectedCase ? selectedCase.case_id : `doc-${file.name.replace(/\s+/g, '-')}`;
      const documentName = selectedCase ? selectedCase.title : file.name;
      
      // Record the verification event in the blockchain
      recordDocumentEvent(
        status === 'verified' ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_MODIFIED',
        documentId,
        documentName,
        'current-user', // In a real app, get this from authentication context
        userEmail || 'user@example.com', // Now using actual user email
        `Document ${status === 'verified' ? 'verification succeeded' : 'verification failed - possible tampering detected'}`
      );
      
      setVerificationResult({
        status,
        originalHash: simulatedStoredHash,
        currentHash: currentHash,
        lastVerified: new Date().toISOString(),
        documentId,
        documentName
      });
      
      toast[status === 'verified' ? 'success' : 'error'](
        status === 'verified' 
          ? "Document verified successfully" 
          : "Document verification failed",
        {
          description: status === 'verified' 
            ? "The document integrity is verified and matches our records." 
            : "The document may have been modified since it was last stored."
        }
      );
      
      // Show audit trail notification for verified documents
      if (status === 'verified') {
        setTimeout(() => {
          toast.info("Verification recorded in audit trail", { 
            description: "You can view the verification record in the document audit trail."
          });
        }, 1500);
      }
      
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Verification failed", { 
        description: "There was an error verifying the document integrity." 
      });
    }
  };

  const viewAuditTrail = () => {
    if (!verificationResult.documentId) return;
    
    // Navigate to the document manager with the audit trail tab selected
    navigate(`/documents?documentId=${encodeURIComponent(verificationResult.documentId)}&documentName=${encodeURIComponent(verificationResult.documentName || '')}&tab=audit-trail`);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Document Verification
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
        <div className="grid gap-4">
          {selectedCase && (
            <div>
              <p className="text-sm font-medium mb-1">Selected Case:</p>
              <div className="bg-muted p-2 rounded text-xs sm:text-sm">
                {selectedCase.title} ({selectedCase.case_id})
              </div>
            </div>
          )}
          
          <div>
            <Input
              id="document-verification"
              type="file"
              onChange={handleFileChange}
              className="mb-3 sm:mb-4 text-sm"
            />
            {file && (
              <p className={`text-xs sm:text-sm bg-muted p-2 rounded ${isMobile ? "break-all" : ""}`}>
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          
          <Button 
            onClick={verifyDocument} 
            disabled={!file}
            className="w-full text-sm"
            size={isMobile ? "sm" : "default"}
          >
            Verify Document Integrity
          </Button>
        </div>

        {verificationResult.status && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-md border ${
            verificationResult.status === 'verified' 
              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' 
              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
          }`}>
            <div className="flex items-center mb-3 sm:mb-4">
              {verificationResult.status === 'verified' ? (
                <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-500 mr-2" />
              ) : (
                <ShieldX className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 dark:text-red-500 mr-2" />
              )}
              <h3 className="text-base sm:text-lg font-medium">
                {verificationResult.status === 'verified' 
                  ? 'Document integrity verified' 
                  : 'Document may be altered!'}
              </h3>
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm">
              <p><strong>Verification time:</strong> {new Date(verificationResult.lastVerified || '').toLocaleString()}</p>
              <div>
                <p className="font-medium">Original hash:</p>
                <p className="text-xs break-all font-mono bg-black bg-opacity-80 text-white p-2 rounded">
                  {verificationResult.originalHash}
                </p>
              </div>
              <div>
                <p className="font-medium">Current hash:</p>
                <p className="text-xs break-all font-mono bg-black bg-opacity-80 text-white p-2 rounded">
                  {verificationResult.currentHash}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className={`${isMobile ? "px-4 py-4 flex-col" : ""}`}>
        {verificationResult.status && (
          <Button 
            onClick={viewAuditTrail} 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className={`text-sm ${isMobile ? "w-full mb-2" : ""}`}
          >
            <History className="mr-2 h-4 w-4" />
            View Audit Trail
          </Button>
        )}
        {verificationResult.status === 'verified' && (
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className={`text-sm ${isMobile ? "w-full" : "ml-auto"}`}
          >
            Export Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
