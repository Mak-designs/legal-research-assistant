
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { FileWarning } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";
import { useTamperDetection } from "@/hooks/use-tamper-detection";
import { TamperDetectionForm } from "./tamper-detection/TamperDetectionForm";
import { VerificationResultDisplay } from "./tamper-detection/VerificationResult";
import { ActionButtons } from "./tamper-detection/ActionButtons";

export const DocumentTamperDetection: React.FC = () => {
  const { isMobile } = useDeviceType();
  const {
    documentName,
    setDocumentName,
    originalContent,
    setOriginalContent,
    currentContent,
    setCurrentContent,
    isVerifying,
    verificationResult,
    handleVerify,
    handleReset
  } = useTamperDetection();

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
          <TamperDetectionForm 
            documentName={documentName}
            setDocumentName={setDocumentName}
            originalContent={originalContent}
            setOriginalContent={setOriginalContent}
            currentContent={currentContent}
            setCurrentContent={setCurrentContent}
            isVerifying={isVerifying}
            onVerify={handleVerify}
          />
        ) : (
          <VerificationResultDisplay 
            result={verificationResult}
            documentName={documentName}
            onReset={handleReset}
          />
        )}
      </CardContent>
      
      {verificationResult && !verificationResult.match && (
        <CardFooter className={`${isMobile ? "px-4 py-4" : ""} ${isMobile ? "flex-col" : "flex-row"}`}>
          <ActionButtons isMobile={isMobile} />
        </CardFooter>
      )}
    </Card>
  );
};
