
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { FileSignature, CheckCircle, X } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { generateHash, signDocument, getCertificates, Certificate, DigitalSignature } from "@/utils/signatureUtil";

interface SignDocumentProps {
  documentId: string;
  documentName: string;
  documentContent: string;
  onSignComplete?: (signature: DigitalSignature) => void;
}

export const SignDocument = ({ 
  documentId, 
  documentName, 
  documentContent,
  onSignComplete 
}: SignDocumentProps) => {
  const { isMobile } = useDeviceType();
  const [documentHash, setDocumentHash] = useState<string>("");
  const [selectedCertificate, setSelectedCertificate] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);

  useEffect(() => {
    const generateDocumentHash = async () => {
      const hash = await generateHash(documentContent);
      setDocumentHash(hash);
    };
    
    generateDocumentHash();
    setCertificates(getCertificates());
  }, [documentContent]);

  const handleSign = async () => {
    if (!selectedCertificate) {
      toast.error("Please select a certificate to sign with");
      return;
    }

    if (pin.length < 4) {
      toast.error("Please enter a valid PIN (minimum 4 digits)");
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real app, the PIN would be used for authentication or to unlock a private key
      // Here we're just using it as a placeholder
      const signature = await signDocument(documentId, documentContent, selectedCertificate);
      
      setSignatureComplete(true);
      toast.success("Document signed successfully!");
      
      if (onSignComplete) {
        onSignComplete(signature);
      }
    } catch (error) {
      console.error("Error signing document:", error);
      toast.error("Failed to sign document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSignatureComplete(false);
    setPin("");
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <FileSignature className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Sign Document
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
        {signatureComplete ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Document Signed Successfully</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your digital signature has been cryptographically attached to this document
            </p>
            <Button onClick={resetForm} variant="outline" size={isMobile ? "sm" : "default"}>
              Sign Another Document
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-name">Document</Label>
              <p className="text-sm font-medium mt-1">{documentName}</p>
            </div>
            
            <div>
              <Label htmlFor="document-hash">Document Hash</Label>
              <div className="bg-muted font-mono text-xs p-2 mt-1 rounded break-all">
                {documentHash || "Calculating..."}
              </div>
            </div>
            
            <div>
              <Label htmlFor="certificate-select">Signing Certificate</Label>
              <Select 
                value={selectedCertificate} 
                onValueChange={setSelectedCertificate}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a certificate" />
                </SelectTrigger>
                <SelectContent>
                  {certificates.map(cert => (
                    <SelectItem key={cert.id} value={cert.id}>
                      {cert.name} ({cert.role}) - Bar #{cert.barNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="pin">Enter PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN to sign"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your PIN authorizes the use of your digital certificate
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      {!signatureComplete && (
        <CardFooter className={`flex justify-end gap-2 ${isMobile ? "px-4 py-4" : ""}`}>
          <Button variant="outline" size={isMobile ? "sm" : "default"}>
            Cancel
          </Button>
          <Button 
            onClick={handleSign} 
            disabled={!selectedCertificate || pin.length < 4 || isLoading}
            size={isMobile ? "sm" : "default"}
          >
            {isLoading ? "Signing..." : "Sign Document"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
