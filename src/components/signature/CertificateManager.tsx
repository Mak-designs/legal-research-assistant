
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Shield, Download, RefreshCw, XCircle } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { getCertificates, Certificate } from "@/utils/signatureUtil";

export const CertificateManager = () => {
  const { isMobile } = useDeviceType();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = () => {
    const certs = getCertificates();
    setCertificates(certs);
    if (certs.length > 0 && !selectedCertificate) {
      setSelectedCertificate(certs[0]);
    }
  };

  const handleExportCertificate = () => {
    if (!selectedCertificate) return;
    
    // In a real app, this would export the certificate in an appropriate format
    toast.success(`Certificate for ${selectedCertificate.name} exported`);
  };

  const handleRenewCertificate = () => {
    if (!selectedCertificate) return;
    
    toast.success(`Certificate renewal process initiated for ${selectedCertificate.name}`);
    // In a real app, this would trigger a renewal workflow
  };

  const handleRevokeCertificate = () => {
    if (!selectedCertificate) return;
    
    toast.success(`Certificate for ${selectedCertificate.name} has been revoked`);
    // In a real app, this would trigger a revocation process
  };

  const getCertificateStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600';
      case 'expired': return 'text-amber-600';
      case 'revoked': return 'text-red-600';
      default: return '';
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Digital Signature Certificates
        </CardTitle>
        <CardDescription>
          Manage your digital certificates for document signing
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-4" : ""}`}>
        <div>
          <h3 className="text-sm font-medium mb-2">Active Certificates:</h3>
          <div className="space-y-2">
            {certificates.map(cert => (
              <div 
                key={cert.id}
                className={`p-2 rounded border cursor-pointer ${
                  selectedCertificate?.id === cert.id ? 'bg-accent border-primary' : 'bg-muted/50'
                }`}
                onClick={() => setSelectedCertificate(cert)}
              >
                <p className="font-medium text-sm">{cert.name}</p>
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(cert.expires).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {selectedCertificate && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm mb-3">Certificate Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground text-xs">Name:</span>
                <span className="col-span-2 font-medium">{selectedCertificate.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground text-xs">Role:</span>
                <span className="col-span-2">{selectedCertificate.role}</span>
              </div>
              {selectedCertificate.barNumber && (
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground text-xs">Bar Number:</span>
                  <span className="col-span-2">{selectedCertificate.barNumber}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground text-xs">Public Key:</span>
                <span className="col-span-2 font-mono text-xs truncate">
                  {selectedCertificate.publicKey}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground text-xs">Issued:</span>
                <span className="col-span-2">
                  {new Date(selectedCertificate.issued).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground text-xs">Expires:</span>
                <span className="col-span-2">
                  {new Date(selectedCertificate.expires).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground text-xs">Status:</span>
                <span className={`col-span-2 capitalize font-medium ${
                  getCertificateStatusColor(selectedCertificate.status)
                }`}>
                  {selectedCertificate.status}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleExportCertificate}
                className="text-xs sm:text-sm"
              >
                <Download className="mr-1 h-3.5 w-3.5" />
                Export Certificate
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleRenewCertificate}
                className="text-xs sm:text-sm"
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Renew Certificate
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleRevokeCertificate}
                className="text-xs sm:text-sm text-destructive hover:text-destructive"
              >
                <XCircle className="mr-1 h-3.5 w-3.5" />
                Revoke Certificate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
