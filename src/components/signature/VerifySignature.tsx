
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { ShieldCheck, ShieldX, Clock } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { verifySignature } from "@/utils/signatureUtil";

interface VerifySignatureProps {
  documentId: string;
  documentName: string;
  documentContent: string;
}

export const VerifySignature = ({ 
  documentId, 
  documentName, 
  documentContent 
}: VerifySignatureProps) => {
  const { isMobile } = useDeviceType();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    signatures: Array<{
      signatoryName: string;
      signatoryRole: string;
      timestamp: string;
      verified: boolean;
    }>;
  } | null>(null);

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const result = await verifySignature(documentId, documentContent);
      setVerificationResult(result);
      
      if (result.verified) {
        toast.success("Document verification successful!");
      } else if (result.signatures.length === 0) {
        toast.error("No signatures found for this document.");
      } else {
        toast.error("Document verification failed! Signatures may be invalid.");
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Failed to verify document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-verify when the component mounts
    handleVerify();
  }, [documentId, documentContent]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <ShieldCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Signature Verification
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
        {isLoading ? (
          <div className="flex flex-col items-center py-6 text-center">
            <Clock className="h-10 w-10 text-primary mb-3 animate-spin" />
            <p>Verifying document signatures...</p>
          </div>
        ) : verificationResult ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="flex items-center">
                {verificationResult.verified ? (
                  <ShieldCheck className="h-8 w-8 text-green-500 mr-2" />
                ) : (
                  <ShieldX className="h-8 w-8 text-red-500 mr-2" />
                )}
                <div>
                  <p className="font-medium">Document: {documentName}</p>
                  <p className={`text-sm ${verificationResult.verified ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {verificationResult.verified ? 'AUTHENTIC' : 'INVALID'}
                  </p>
                </div>
              </div>
              
              <div className="sm:ml-auto text-xs text-muted-foreground">
                Verification Time: {formatDate(new Date().toISOString())}
              </div>
            </div>
            
            {verificationResult.signatures.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium mb-2">Signatures:</h3>
                <div className="space-y-3">
                  {verificationResult.signatures.map((sig, index) => (
                    <div key={index} className="flex items-start bg-muted/50 p-2 rounded">
                      {sig.verified ? (
                        <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <ShieldX className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div className="text-xs sm:text-sm">
                        <p className="font-medium">{sig.signatoryName} ({sig.signatoryRole})</p>
                        <p className="text-muted-foreground">Signed: {formatDate(sig.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <p>No signatures found for this document.</p>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
      
      <CardFooter className={`flex justify-end ${isMobile ? "px-4 py-4" : ""}`}>
        <Button 
          onClick={handleVerify} 
          disabled={isLoading}
          size={isMobile ? "sm" : "default"}
        >
          {isLoading ? "Verifying..." : "Verify Again"}
        </Button>
      </CardFooter>
    </Card>
  );
};
