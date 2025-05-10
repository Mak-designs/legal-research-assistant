import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Block, getAllBlocks, getLatestBlock, verifyBlockchain } from "@/utils/blockchainUtil";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Search, ShieldCheck, Clock, Shield, FileCheck } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

export const SystemAuditDashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [verifiedDocuments, setVerifiedDocuments] = useState<{
    documentId: string;
    documentName: string;
    verifiedAt: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [latestBlock, setLatestBlock] = useState<Block | null>(null);
  const [lastVerified, setLastVerified] = useState<Date>(new Date());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const {
    isMobile,
    isTablet
  } = useDeviceType();
  
  // Get current user email on component mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setUserEmail(session.user.email || null);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };
    
    fetchUserEmail();
  }, []);
  
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setIsLoading(true);
        
        // Get all blocks and sort by most recent
        const allBlocks = getAllBlocks().sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Get only verified documents for the current user
        if (userEmail) {
          const verifiedDocs = allBlocks
            .filter(block => 
              block.data.type === 'DOCUMENT_VERIFIED' && 
              block.data.userEmail === userEmail
            )
            .map(block => ({
              documentId: block.data.documentId || '',
              documentName: block.data.documentName || '',
              verifiedAt: block.timestamp
            }));
          
          // Remove duplicates (only keep latest verification per document)
          const uniqueDocs = verifiedDocs.reduce((acc, current) => {
            const x = acc.find(item => item.documentId === current.documentId);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, [] as typeof verifiedDocs);
          
          setVerifiedDocuments(uniqueDocs);
        }

        // For display, limit to most recent blocks that belong to the current user
        const userBlocks = userEmail 
          ? allBlocks.filter(block => block.data.userEmail === userEmail)
          : [];
          
        setBlocks(userBlocks.slice(0, 10));

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
    
    if (userEmail) {
      fetchBlocks();
    }
  }, [userEmail]);
  
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
  
  return (
    <Card className="shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="text-lg sm:text-xl flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Blockchain Audit Dashboard
        </CardTitle>
        <CardDescription>
          Verified documents and blockchain integrity verification
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-4" : ""}`}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Verified Documents Section */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <FileCheck className="h-4 w-4 mr-1" /> Your Verified Documents:
              </h3>
              
              {verifiedDocuments.length > 0 ? (
                <div className="space-y-3">
                  {verifiedDocuments.map((doc, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{doc.documentName}</p>
                        <p className="text-xs text-muted-foreground">{doc.documentId}</p>
                        <p className="text-xs">Verified: {formatDate(doc.verifiedAt)}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          window.location.href = `/documents?documentId=${encodeURIComponent(doc.documentId)}&documentName=${encodeURIComponent(doc.documentName)}&tab=audit-trail`;
                        }}
                      >
                        View Trail
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">No verified documents found</p>
                  <p className="text-xs mt-1">Visit the Document Verification page to verify documents</p>
                </div>
              )}
            </div>
            
            {/* Blockchain Stats */}
            <div>
              <h3 className="text-sm font-medium mb-3">Blockchain Integrity:</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Status:</p>
                  {isVerified !== null && (
                    <div className="flex items-center mt-1">
                      {isVerified ? (
                        <>
                          <ShieldCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-sm font-medium text-red-600">Compromised</span>
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-xs mt-2">Last checked: {formatDate(lastVerified.toISOString())}</p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Latest Block:</p>
                  {latestBlock && (
                    <div className="mt-1">
                      <p className="text-xs font-mono">#{latestBlock.index}</p>
                      <p className="text-xs font-mono truncate">{latestBlock.hash.substring(0, 16)}...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            {blocks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Recent Activity:
                </h3>
                <div className="space-y-2">
                  {blocks.slice(0, 5).map((block, index) => (
                    <div key={index} className="text-xs border-l-2 border-gray-300 pl-2 py-1">
                      <p className="text-muted-foreground">{formatDate(block.timestamp)} - {block.data.type}</p>
                      {block.data.documentName && (
                        <p className="font-medium">{block.data.documentName}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className={`${isMobile ? "px-4 py-4 flex-col space-y-2" : "space-x-2"}`}>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={handleVerifyChain}
          className="flex items-center"
        >
          <Shield className="mr-2 h-4 w-4" />
          Verify Blockchain
        </Button>
        
        {blocks.length > 0 && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleExportAudit}
            className={`flex items-center ${isMobile ? "w-full" : ""}`}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Audit Log
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
