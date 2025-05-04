
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ShieldCheck, ShieldX, Search, FileDigit } from "lucide-react";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl sm:text-2xl">
          <FileDigit className="mr-2 h-5 w-5" />
          Document Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">
              Select a document to verify its integrity using cryptographic hashing
            </p>
            <div className="bg-muted/50 rounded-lg p-4 border border-dashed border-muted-foreground/50">
              <Input
                id="document-verification"
                type="file"
                onChange={handleFileChange}
                className="mb-2"
              />
              {file && (
                <p className="text-sm bg-muted p-2 rounded mt-2 break-all">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
          
          <Button 
            onClick={verifyDocument} 
            disabled={!file}
            className="w-full"
            size={isMobile ? "sm" : "default"}
          >
            <Search className="mr-1 h-4 w-4" />
            Verify Document Integrity
          </Button>
        </div>

        {verificationResult.status && (
          <div className={`mt-6 p-3 sm:p-4 rounded-md border ${
            verificationResult.status === 'verified' 
              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
          }`}>
            <div className="flex items-center mb-3">
              {verificationResult.status === 'verified' ? (
                <ShieldCheck className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-green-600 dark:text-green-400 mr-2`} />
              ) : (
                <ShieldX className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-red-600 dark:text-red-400 mr-2`} />
              )}
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>
                {verificationResult.status === 'verified' 
                  ? 'Document integrity verified' 
                  : 'Document may be altered!'}
              </h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-xs sm:text-sm"><strong>Verification time:</strong> {new Date(verificationResult.lastVerified || '').toLocaleString()}</p>
              <div className="mt-3">
                <p className="font-medium text-xs sm:text-sm">Original hash:</p>
                <p className="text-xs break-all font-mono bg-black bg-opacity-80 text-white p-2 rounded overflow-x-auto scrollbar-thin">
                  {verificationResult.originalHash}
                </p>
              </div>
              <div className="mt-2">
                <p className="font-medium text-xs sm:text-sm">Current hash:</p>
                <p className="text-xs break-all font-mono bg-black bg-opacity-80 text-white p-2 rounded overflow-x-auto scrollbar-thin">
                  {verificationResult.currentHash}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {verificationResult.status === 'verified' && (
          <Button variant="outline" size={isMobile ? "sm" : "default"}>
            Export Verification Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
