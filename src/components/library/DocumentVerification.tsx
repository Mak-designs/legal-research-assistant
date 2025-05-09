
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { ShieldCheck, ShieldX, Search, FileText } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavedCase } from "@/components/library/types";

export const DocumentVerification = () => {
  const [file, setFile] = useState<File | null>(null);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'modified' | null;
    originalHash?: string;
    currentHash?: string;
    lastVerified?: string;
  }>({ status: null });
  const { isMobile } = useDeviceType();

  // Fetch saved cases when component mounts
  useEffect(() => {
    const fetchSavedCases = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          return;
        }

        const { data, error } = await supabase
          .from('saved_cases')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setSavedCases(data || []);
      } catch (error) {
        console.error("Error fetching saved cases:", error);
        toast.error("Failed to load your saved cases");
      }
    };

    fetchSavedCases();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult({ status: null });
    }
  };

  const verifyDocument = async () => {
    if (!file) {
      toast.error("Please select a document to verify");
      return;
    }

    try {
      setIsLoading(true);
      // In a real implementation, you'd send the file to your backend for verification
      // against stored hash values. Here we're simulating the verification process
      const arrayBuffer = await file.arrayBuffer();
      const hashArray = new Uint8Array(await crypto.subtle.digest('SHA-256', arrayBuffer));
      const currentHash = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Check if we have a selected case to verify against
      let simulatedStoredHash = currentHash;
      let caseInfo = null;
      
      if (selectedCaseId) {
        // Find the selected case
        const selectedCase = savedCases.find(c => c.id === selectedCaseId);
        if (selectedCase) {
          caseInfo = selectedCase;
          
          // In a real implementation, you would use the hash stored with the case
          // Here we're simulating a 70% chance of verification success for selected cases
          if (Math.random() > 0.3) {
            simulatedStoredHash = currentHash;
          } else {
            simulatedStoredHash = 'differenthash123456789';
          }
        }
      } else {
        // If no case is selected, use the original random simulation
        simulatedStoredHash = Math.random() > 0.3 ? currentHash : 'differenthash123456789';
      }
      
      const isVerified = currentHash === simulatedStoredHash;
      
      setVerificationResult({
        status: isVerified ? 'verified' : 'modified',
        originalHash: simulatedStoredHash,
        currentHash: currentHash,
        lastVerified: new Date().toISOString()
      });
      
      const toastMessage = isVerified 
        ? caseInfo 
          ? `Document verified against case: ${caseInfo.title}` 
          : "Document integrity verified"
        : caseInfo 
          ? `Document does not match case: ${caseInfo.title}` 
          : "Document verification failed";
        
      toast({
        title: isVerified ? "Document verified" : "Document verification failed",
        description: toastMessage,
        variant: isVerified ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("There was an error verifying the document integrity.");
    } finally {
      setIsLoading(false);
    }
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
          <div>
            <label htmlFor="case-selection" className="block text-sm font-medium mb-2">
              Select a saved case to verify against (optional)
            </label>
            <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific case</SelectItem>
                {savedCases.map((caseItem) => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      {caseItem.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
            disabled={!file || isLoading}
            className="w-full text-sm"
            size={isMobile ? "sm" : "default"}
          >
            {isLoading ? "Verifying..." : "Verify Document Integrity"}
          </Button>
        </div>

        {verificationResult.status && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-md border ${
            verificationResult.status === 'verified' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-3 sm:mb-4">
              {verificationResult.status === 'verified' ? (
                <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-2" />
              ) : (
                <ShieldX className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-2" />
              )}
              <h3 className="text-base sm:text-lg font-medium">
                {verificationResult.status === 'verified' 
                  ? 'Document integrity verified' 
                  : 'Document may be altered!'}
              </h3>
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm">
              <p><strong>Verification time:</strong> {new Date(verificationResult.lastVerified || '').toLocaleString()}</p>
              {selectedCaseId && (
                <p><strong>Verified against case:</strong> {
                  savedCases.find(c => c.id === selectedCaseId)?.title || 'Unknown case'
                }</p>
              )}
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
      <CardFooter className={`flex justify-end ${isMobile ? "px-4 py-4" : ""}`}>
        {verificationResult.status === 'verified' && (
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="text-sm">
            Export Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
