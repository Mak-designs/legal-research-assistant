
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
  getAllBlocks, 
  getLatestBlock,
  verifyBlockchain 
} from "@/utils/blockchainUtil";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Download, 
  Search, 
  ShieldCheck, 
  Clock, 
  Shield
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";

export const SystemAuditDashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [latestBlock, setLatestBlock] = useState<Block | null>(null);
  const [lastVerified, setLastVerified] = useState<Date>(new Date());
  const { isMobile, isTablet } = useDeviceType();

  useEffect(() => {
    const fetchBlocks = () => {
      try {
        setIsLoading(true);
        // Get all blocks and sort by most recent
        const allBlocks = getAllBlocks().sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // For display, limit to most recent blocks
        setBlocks(allBlocks.slice(0, 10));
        
        // Get latest block
        setLatestBlock(getLatestBlock());
        
        // Verify blockchain integrity
        const verification = verifyBlockchain();
        setIsVerified(verification.valid);
        setLastVerified(new Date());
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        toast.error("Failed to retrieve system audit data");
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
  }, []);

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
    // This would export the audit log in a real application
    toast.success("Audit log exported successfully");
  };

  const handleVerifyChain = () => {
    try {
      // Re-verify the blockchain
      const verification = verifyBlockchain();
      setIsVerified(verification.valid);
      setLastVerified(new Date());
      
      if (verification.valid) {
        toast.success("Blockchain integrity verified successfully");
      } else {
        toast.error(`Verification failed - ${verification.invalidBlocks.length} invalid blocks found`);
      }
    } catch (error) {
      console.error("Error verifying blockchain:", error);
      toast.error("Failed to verify blockchain integrity");
    }
  };

  const handleSearchRecords = () => {
    // This would open a search dialog in a real application
    toast.info("Search functionality would open here");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="text-lg sm:text-xl flex items-center">
          System Audit Dashboard
        </CardTitle>
        <CardDescription>
          Blockchain-secured system activity log
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Recent Activity:</h3>
              <ul className="space-y-2">
                {blocks.map((block) => {
                  const eventType = block.data.type;
                  let description = '';
                  
                  switch (eventType) {
                    case 'USER_LOGIN':
                      description = `User login: ${block.data.userEmail.split('@')[0]}`;
                      break;
                    case 'SEARCH_PERFORMED':
                      description = `Search performed: "${block.data.details?.replace('Search query: ', '')}"`;
                      break;
                    case 'DOCUMENT_CREATED':
                      description = `Document created: ${block.data.documentId}`;
                      break;
                    case 'DOCUMENT_EDITED':
                      description = `Document edited: ${block.data.documentId}`;
                      break;
                    case 'DOCUMENT_REVIEWED':
                      description = `Document reviewed: ${block.data.documentId}`;
                      break;
                    case 'DOCUMENT_FINALIZED':
                      description = `Document finalized: ${block.data.documentId}`;
                      break;
                    case 'DOCUMENT_EXPORTED':
                      description = `Document downloaded: ${block.data.documentId}`;
                      break;
                    default:
                      description = `${eventType.toLowerCase()}: ${block.data.details || ''}`;
                  }
                  
                  return (
                    <li key={block.hash} className="text-xs sm:text-sm flex items-center">
                      <span className="text-muted-foreground">-</span>
                      <span className="ml-2">{description}</span>
                      <span className="ml-auto text-muted-foreground text-xs">
                        ({formatDate(block.timestamp)})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="bg-muted p-3 rounded-md mt-4">
              <h3 className="text-sm font-medium mb-2">System Status:</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center">
                  <ShieldCheck className={`h-4 w-4 mr-2 ${isVerified ? 'text-green-600' : 'text-red-600'}`} />
                  Blockchain integrity {isVerified ? 'verified' : 'compromised'} ({getAllBlocks().length} blocks)
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Last verification: {formatDate(lastVerified.toISOString())}
                </div>
                {latestBlock && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    Current block: #{latestBlock.index} (Hash: {latestBlock.hash.substring(0, 12)}...)
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className={`${isMobile ? "px-4 py-4" : ""} ${isMobile ? "flex-col space-y-2" : "flex-row space-x-2"} ${isMobile ? "" : "justify-end"}`}>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={handleSearchRecords}
          disabled={isLoading}
          className={isMobile ? "w-full" : ""}
        >
          <Search className="h-4 w-4 mr-2" /> Search Records
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={handleVerifyChain}
          disabled={isLoading}
          className={isMobile ? "w-full" : ""}
        >
          <ShieldCheck className="h-4 w-4 mr-2" /> Verify Chain
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={handleExportAudit}
          disabled={isLoading}
          className={isMobile ? "w-full" : ""}
        >
          <Download className="h-4 w-4 mr-2" /> Export Audit Log
        </Button>
      </CardFooter>
    </Card>
  );
};
