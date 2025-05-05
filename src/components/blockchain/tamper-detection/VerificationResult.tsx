
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { VerificationResult } from "@/hooks/use-tamper-detection";

interface VerificationResultProps {
  result: VerificationResult;
  documentName: string;
  onReset: () => void;
}

export const VerificationResultDisplay: React.FC<VerificationResultProps> = ({
  result,
  documentName,
  onReset,
}) => {
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
    <div>
      <div className={`mb-6 p-4 rounded-md border ${
        result.match 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900' 
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <div className="flex items-center">
            {result.match ? (
              <ShieldCheck className="h-8 w-8 text-green-600 mr-2" />
            ) : (
              <ShieldAlert className="h-8 w-8 text-red-600 mr-2" />
            )}
            <div>
              <h3 className="text-base sm:text-lg font-medium">
                {result.match ? 'DOCUMENT VERIFICATION RESULT' : '⚠️ DOCUMENT TAMPERING DETECTED ⚠️'}
              </h3>
              <p className="text-sm">Document: {documentName}</p>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              result.match ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Status: {result.match ? '✓ VERIFIED' : '⛔ MODIFIED'}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Original Hash:</p>
            <p className="text-xs font-mono break-all bg-black/80 text-white p-2 rounded">
              {result.originalHash} (registered {formatDate(result.timestamp || '')})
            </p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Current Hash:</p>
            <p className="text-xs font-mono break-all bg-black/80 text-white p-2 rounded">
              {result.currentHash} (calculated {formatDate(new Date().toISOString())})
            </p>
          </div>
        </div>
        
        {result.match ? (
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
              {result.sections?.map((section, index) => (
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
              <p>Timestamp of original document: {formatDate(result.timestamp || '')}</p>
              {result.lastAccess && (
                <p>Last access before modification: {formatDate(result.lastAccess.date)} by {result.lastAccess.user}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onReset}
        variant="outline"
        className="w-full mb-4"
      >
        Verify Another Document
      </Button>
    </div>
  );
};
