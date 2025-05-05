
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ShieldCheck, ShieldX, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const DocumentVerification = () => {
  const [file, setFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'modified' | null;
    originalHash?: string;
    currentHash?: string;
    lastVerified?: string;
  }>({ status: null });
  const isMobile = useIsMobile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult({ status: null });
    }
  };

  const verifyDocument = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a document to verify",
        variant: "destructive"
      });
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
      
      setVerificationResult({
        status: currentHash === simulatedStoredHash ? 'verified' : 'modified',
        originalHash: simulatedStoredHash,
        currentHash: currentHash,
        lastVerified: new Date().toISOString()
      });
      
      toast({
        title: currentHash === simulatedStoredHash 
          ? "Document verified" 
          : "Document verification failed",
        description: currentHash === simulatedStoredHash 
          ? "The document integrity is verified and matches our records." 
          : "The document may have been modified since it was last stored.",
        variant: currentHash === simulatedStoredHash ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error verifying document:", error);
      toast({
        title: "Verification failed",
        description: "There was an error verifying the document integrity.",
        variant: "destructive"
      });
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
