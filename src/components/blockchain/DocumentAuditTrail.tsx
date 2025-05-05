
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Block, 
  getDocumentBlocks, 
  verifyBlockchain 
} from "@/utils/blockchainUtil";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileCheck, FileWarning, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";

interface DocumentAuditTrailProps {
  documentId: string;
  documentName: string;
}

export const DocumentAuditTrail: React.FC<DocumentAuditTrailProps> = ({
  documentId,
  documentName
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const fetchBlocks = () => {
      try {
        setIsLoading(true);
        // Get blocks related to this document
        const documentBlocks = getDocumentBlocks(documentId);
        setBlocks(documentBlocks);
        
        // Verify blockchain integrity
        const verification = verifyBlockchain();
        setIsVerified(verification.valid);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        toast.error("Failed to retrieve audit trail");
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
  }, [documentId]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleExportAudit = () => {
    // This would export the audit trail data in a real application
    toast.success("Audit trail exported successfully");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="text-lg sm:text-xl flex items-center">
          Document Audit Trail
        </CardTitle>
        <CardDescription>
          Cryptographically secured history for {documentName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : blocks.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No audit trail found for this document
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">Document ID: {documentId}</Badge>
                {isVerified !== null && (
                  <Badge variant={isVerified ? "default" : "destructive"}>
                    {isVerified ? "Verified" : "Verification Failed"}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium">Timeline:</h3>
              <ul className="space-y-3">
                {blocks.map((block, index) => (
                  <li key={block.hash} className="relative pl-6 pb-3 border-l-2 border-gray-200 dark:border-gray-800">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(block.timestamp)} - {block.data.type} by {block.data.userEmail}
                    </div>
                    <div className="mt-1 text-xs font-mono">
                      └── Block #{block.index} | Hash: {block.hash.substring(0, 12)}...
                    </div>
                    {block.data.details && (
                      <div className="mt-1 text-xs italic text-muted-foreground">
                        {block.data.details}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center mt-4 bg-muted rounded-md p-2">
              {isVerified ? (
                <div className="flex items-center text-green-600 text-xs sm:text-sm">
                  <FileCheck className="h-4 w-4 mr-1" /> Timeline Verified - All records cryptographically secured
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-xs sm:text-sm">
                  <FileWarning className="h-4 w-4 mr-1" /> Verification failed - Blockchain integrity compromised
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className={isMobile ? "px-4 py-4" : ""}>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          onClick={handleExportAudit}
          disabled={blocks.length === 0 || isLoading}
          className="ml-auto"
        >
          <Download className="h-4 w-4 mr-2" /> Export Audit Log
        </Button>
      </CardFooter>
    </Card>
  );
};
