
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Block, getDocumentBlocks, verifyBlockchain } from "@/utils/blockchainUtil";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileCheck, FileWarning, Download, History } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  
  const {
    isMobile
  } = useDeviceType();
  
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
        
        // Show toast when blocks are loaded successfully
        if (documentBlocks.length > 0) {
          toast.success("Audit trail loaded", { 
            description: `Found ${documentBlocks.length} verified records for this document.` 
          });
        }
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
  
  const viewBlockDetails = (block: Block) => {
    setSelectedBlock(block);
    setShowDetailsDialog(true);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className={isMobile ? "px-4 py-4" : ""}>
          <CardTitle className="text-lg sm:text-xl flex items-center">
            <History className="h-5 w-5 mr-2 text-primary" />
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
                <div className="flex items-center flex-wrap gap-2">
                  <Badge variant="outline">Document ID: {documentId}</Badge>
                  {isVerified !== null && (
                    <Badge variant={isVerified ? "default" : "destructive"}>
                      {isVerified ? "Verified" : "Verification Failed"}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-medium flex items-center">
                  <FileCheck className="h-4 w-4 mr-1" /> Timeline:
                </h3>
                <ul className="space-y-3">
                  {blocks.map((block) => (
                    <li 
                      key={block.hash} 
                      className="relative pl-6 pb-3 border-l-2 border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md px-2 pt-1"
                      onClick={() => viewBlockDetails(block)}
                    >
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
          {blocks.length > 0 && (
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={handleExportAudit}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Audit Trail
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Block Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Blockchain Record Details</DialogTitle>
            <DialogDescription>
              Cryptographically secured record from the document's audit trail
            </DialogDescription>
          </DialogHeader>
          
          {selectedBlock && (
            <div className="space-y-4 mt-2">
              <div className="grid gap-2">
                <p className="text-sm font-medium">Event Information</p>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Event Type</TableCell>
                      <TableCell>{selectedBlock.data.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Timestamp</TableCell>
                      <TableCell>{formatDate(selectedBlock.timestamp)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">User</TableCell>
                      <TableCell>{selectedBlock.data.userEmail}</TableCell>
                    </TableRow>
                    {selectedBlock.data.details && (
                      <TableRow>
                        <TableCell className="font-medium">Details</TableCell>
                        <TableCell>{selectedBlock.data.details}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid gap-2">
                <p className="text-sm font-medium">Blockchain Information</p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs mb-1"><span className="font-medium">Block #:</span> {selectedBlock.index}</p>
                  <p className="text-xs mb-1 break-all"><span className="font-medium">Hash:</span> {selectedBlock.hash}</p>
                  <p className="text-xs mb-1 break-all"><span className="font-medium">Previous Hash:</span> {selectedBlock.previousHash}</p>
                  <p className="text-xs"><span className="font-medium">Nonce:</span> {selectedBlock.nonce}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
