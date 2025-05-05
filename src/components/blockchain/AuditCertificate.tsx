
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Link, Check } from "lucide-react";
import { generateAuditCertificate } from "@/utils/blockchainUtil";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";

interface AuditCertificateProps {
  documentId: string;
  documentName: string;
  documentContent: string;
}

export const AuditCertificate: React.FC<AuditCertificateProps> = ({
  documentId,
  documentName,
  documentContent,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificate, setCertificate] = useState<{
    documentHash: string;
    blockCount: number;
    certificateHash: string;
    merkleRoot: string;
    timestamp: string;
    registrationId: string;
  } | null>(null);
  const { isMobile } = useDeviceType();

  const handleGenerateCertificate = async () => {
    try {
      setIsGenerating(true);
      // Generate the certificate
      const cert = await generateAuditCertificate(documentId, documentContent);
      setCertificate(cert);
      toast.success("Audit certificate generated successfully");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate audit certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would generate and download a PDF certificate
    toast.success("Certificate downloaded as PDF");
  };

  const handleVerifyOnline = () => {
    // In a real app, this would open a verification portal
    toast.info("Verification would open in a new window");
  };

  const handleExportProof = () => {
    // In a real app, this would export blockchain proof data
    toast.success("Blockchain proof exported successfully");
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="text-lg sm:text-xl">
          Audit Certificate
        </CardTitle>
        <CardDescription>
          Generate cryptographic proof of document integrity
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`${isMobile ? "px-4" : ""}`}>
        {!certificate ? (
          <div className="text-center py-4">
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Generating certificate...</p>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Generate a cryptographic certificate for this document to prove its authenticity and integrity
                </p>
                <Button 
                  onClick={handleGenerateCertificate}
                  className="w-full sm:w-auto"
                >
                  Generate Audit Certificate
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-center font-medium mb-2 text-sm sm:text-base">AUDIT CERTIFICATE</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Document:</p>
                  <p className="text-sm font-medium">{documentName}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Document Hash:</p>
                  <p className="text-xs font-mono bg-black/80 text-white p-2 rounded overflow-x-auto">
                    {certificate.documentHash}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Timeline:</p>
                  <p className="text-sm">{certificate.blockCount} verified blockchain entries</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Certificate Hash:</p>
                  <p className="text-xs font-mono bg-black/80 text-white p-2 rounded overflow-x-auto">
                    {certificate.certificateHash}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Merkle Tree Root:</p>
                  <p className="text-xs font-mono bg-black/80 text-white p-2 rounded overflow-x-auto">
                    {certificate.merkleRoot}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp:</p>
                    <p className="text-sm">{formatDate(certificate.timestamp)}</p>
                  </div>
                  
                  <div className="mt-2 sm:mt-0">
                    <p className="text-xs text-muted-foreground">Registration ID:</p>
                    <p className="text-sm font-medium">{certificate.registrationId}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-600 text-sm">Certificate generated successfully</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {certificate && (
        <CardFooter className={`${isMobile ? "px-4 py-4" : ""} ${isMobile ? "flex-col space-y-2" : "flex-row space-x-2 justify-end"}`}>
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleExportProof}
            className={isMobile ? "w-full" : ""}
          >
            <Link className="h-4 w-4 mr-2" /> Export Blockchain Proof
          </Button>
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleVerifyOnline}
            className={isMobile ? "w-full" : ""}
          >
            <Check className="h-4 w-4 mr-2" /> Verify Online
          </Button>
          <Button 
            variant="default"
            size={isMobile ? "sm" : "default"}
            onClick={handleDownloadCertificate}
            className={isMobile ? "w-full" : ""}
          >
            <Download className="h-4 w-4 mr-2" /> Download PDF Certificate
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
