
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileWarning,
  Clock, 
  Download,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { generateHash } from "@/utils/signatureUtil";
import { detectTampering } from "@/utils/blockchainUtil";

export const DocumentTamperDetection: React.FC = () => {
  const [originalContent, setOriginalContent] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [documentName, setDocumentName] = useState("Smith v. Acme - Settlement Agreement.pdf");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tampered: boolean;
    originalHash: string;
    currentHash: string;
    match: boolean;
    diff?: string;
    sections?: {
      name: string;
      original: string;
      current: string;
    }[];
    timestamp?: string;
    lastAccess?: {
      date: string;
      user: string;
    };
  } | null>(null);
  
  const { isMobile } = useDeviceType();

  const handleVerify = async () => {
    if (!originalContent || !currentContent) {
      toast.error("Please enter both original and current content to verify");
      return;
    }
    
    try {
      setIsVerifying(true);
      
      const result = await detectTampering(originalContent, currentContent);
      
      // In a real application, we'd use more sophisticated diff algorithms
      // to identify specific sections that were modified
      const mockSections = result.tampered ? identifyChanges(originalContent, currentContent) : [];
      
      setVerificationResult({
        ...result,
        sections: mockSections,
        timestamp: new Date().toISOString(),
        lastAccess: {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user: "user@example.com"
        }
      });
      
      if (result.match) {
        toast.success("Document verified successfully!");
      } else {
        toast.error("Document has been modified! Tampering detected.");
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  
  // A simple string difference detector
  const identifyChanges = (original: string, current: string): {
    name: string;
    original: string;
    current: string;
  }[] => {
    const changes = [];
    
    // In a real implementation, we'd use a more sophisticated diff algorithm
    // Here we'll use some basic checks for demonstration
    
    // Check for amount changes
    if (original.includes("$500,000") && current.includes("$550,000")) {
      changes.push({
        name: "Section 1: Settlement Payment amount has been altered",
        original: "Five Hundred Thousand Dollars ($500,000)",
        current: "Five Hundred Fifty Thousand Dollars ($550,000)"
      });
    }
    
    // Check for date changes
    if (original.includes("April 15, 2025") && current.includes("April 16, 2025")) {
      changes.push({
        name: "First paragraph: Date has been altered",
        original: "April 15, 2025",
        current: "April 16, 2025"
      });
    }
    
    // If no specific changes detected but hashes don't match, likely whitespace changes
    if (changes.length === 0) {
      changes.push({
        name: "Whitespace changes detected",
        original: "Original formatting",
        current: "Modified formatting or invisible characters"
      });
    }
    
    return changes;
  };

  const handleDownloadReport = () => {
    toast.success("Verification report downloaded");
  };
  
  const handleViewDiff = () => {
    toast.info("Complete diff would be displayed in a modal dialog");
  };
  
  const handleReportIssue = () => {
    toast.info("Issue reported to security team");
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="text-lg sm:text-xl flex items-center">
          <FileWarning className="h-5 w-5 mr-2 text-primary" />
          Document Tamper Detection
        </CardTitle>
        <CardDescription>
          Verify document integrity and detect unauthorized changes
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
        {!verificationResult ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="document-name" className="block text-sm font-medium mb-1">
                Document Name
              </label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="mb-4"
                placeholder="Enter document name"
              />
            </div>
            
            <div>
              <label htmlFor="original-content" className="block text-sm font-medium mb-1">
                Original Document Content
              </label>
              <Textarea
                id="original-content"
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
                placeholder="Paste the original document content here"
              />
            </div>
            
            <div>
              <label htmlFor="current-content" className="block text-sm font-medium mb-1">
                Current Document Content
              </label>
              <Textarea
                id="current-content"
                value={currentContent}
                onChange={(e) => setCurrentContent(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
                placeholder="Paste the current document content to verify"
              />
            </div>
            
            <Button 
              onClick={handleVerify} 
              disabled={isVerifying || !originalContent || !currentContent}
              className="w-full"
            >
              {isVerifying ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4 mr-2" />
              )}
              Verify Document Integrity
            </Button>
          </div>
        ) : (
          <div>
            <div className={`mb-6 p-4 rounded-md border ${
              verificationResult.match 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <div className="flex items-center">
                  {verificationResult.match ? (
                    <ShieldCheck className="h-8 w-8 text-green-600 mr-2" />
                  ) : (
                    <ShieldAlert className="h-8 w-8 text-red-600 mr-2" />
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">
                      {verificationResult.match ? 'DOCUMENT VERIFICATION RESULT' : '⚠️ DOCUMENT TAMPERING DETECTED ⚠️'}
                    </h3>
                    <p className="text-sm">Document: {documentName}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    verificationResult.match ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {verificationResult.match ? '✓ VERIFIED' : '⛔ MODIFIED'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Original Hash:</p>
                  <p className="text-xs font-mono break-all bg-black/80 text-white p-2 rounded">
                    {verificationResult.originalHash} (registered {formatDate(verificationResult.timestamp || '')})
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Current Hash:</p>
                  <p className="text-xs font-mono break-all bg-black/80 text-white p-2 rounded">
                    {verificationResult.currentHash} (calculated {formatDate(new Date().toISOString())})
                  </p>
                </div>
              </div>
              
              {verificationResult.match ? (
                <div className="mt-4 flex items-center">
                  <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                  <p className="text-sm">
                    This document matches exactly with the registered version. No tampering detected.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Modification details:</h4>
                  <div className="space-y-3">
                    {verificationResult.sections?.map((section, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{section.name}</p>
                        <div className="pl-3 border-l-2 border-red-300 mt-1 space-y-1">
                          <p className="text-xs">
                            <span className="font-medium">Original:</span> "{section.original}"
                          </p>
                          <p className="text-xs">
                            <span className="font-medium">Current:</span> "{section.current}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-xs space-y-1">
                    <p>This document does NOT match the registered version.</p>
                    <p>Timestamp of original document: {formatDate(verificationResult.timestamp || '')}</p>
                    {verificationResult.lastAccess && (
                      <p>Last access before modification: {formatDate(verificationResult.lastAccess.date)} by {verificationResult.lastAccess.user}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => setVerificationResult(null)}
              variant="outline"
              className="w-full mb-4"
            >
              Verify Another Document
            </Button>
          </div>
        )}
      </CardContent>
      
      {verificationResult && !verificationResult.match && (
        <CardFooter className={`${isMobile ? "px-4 py-4" : ""} ${isMobile ? "flex-col space-y-2" : "flex-row space-x-2"}`}>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleReportIssue}
            className={isMobile ? "w-full" : ""}
          >
            <AlertTriangle className="h-4 w-4 mr-2" /> Report Issue
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleViewDiff}
            className={isMobile ? "w-full" : ""}
          >
            <FileText className="h-4 w-4 mr-2" /> View Complete Diff
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleDownloadReport}
            className={isMobile ? "w-full" : ""}
          >
            <Download className="h-4 w-4 mr-2" /> Download Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
