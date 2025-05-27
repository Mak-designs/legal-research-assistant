import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Block, getAllBlocks, getLatestBlock, verifyBlockchain } from "@/utils/blockchain";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Shield } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { VerifiedDocumentsList } from "./VerifiedDocumentsList";
import { BlockchainIntegrityStats } from "./BlockchainIntegrityStats";
import { RecentBlockchainActivity } from "./RecentBlockchainActivity";
import { useDateFormat } from "@/hooks/use-date-format";
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
    isMobile
  } = useDeviceType();
  const {
    formatDate
  } = useDateFormat();

  // Get current user email on component mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
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
        const allBlocks = getAllBlocks().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Get only verified documents for the current user
        if (userEmail) {
          const verifiedDocs = allBlocks.filter(block => block.data.type === 'DOCUMENT_VERIFIED' && block.data.userEmail === userEmail).map(block => ({
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
        const userBlocks = userEmail ? allBlocks.filter(block => block.data.userEmail === userEmail) : [];
        setBlocks(userBlocks.slice(0, 10));

        // Get latest block
        setLatestBlock(getLatestBlock());

        // Verify blockchain integrity
        const verification = verifyBlockchain(allBlocks);
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
  const handleExportAudit = () => {
    // This would export the audit log in a real application
    toast.success("Audit log exported successfully");
  };
  const handleVerifyChain = () => {
    try {
      // Re-verify the blockchain
      const verification = verifyBlockchain(getAllBlocks());
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
  return <Card className="shadow-sm">
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
        {isLoading ? <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div> : <>
            {/* Verified Documents Section */}
            <VerifiedDocumentsList documents={verifiedDocuments} formatDate={formatDate} />
            
            {/* Blockchain Stats */}
            <BlockchainIntegrityStats isVerified={isVerified} lastVerified={lastVerified} latestBlock={latestBlock} formatDate={formatDate} />
            
            {/* Recent Activity */}
            <RecentBlockchainActivity blocks={blocks} formatDate={formatDate} />
          </>}
      </CardContent>
      
      <CardFooter className={`${isMobile ? "px-4 py-4 flex-col space-y-2" : "space-x-2"}`}>
        
        
        {blocks.length > 0}
      </CardFooter>
    </Card>;
};