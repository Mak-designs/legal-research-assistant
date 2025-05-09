import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Block, getAllBlocks, getLatestBlock, verifyBlockchain } from "@/utils/blockchainUtil";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Search, ShieldCheck, Clock, Shield } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDeviceType } from "@/hooks/use-mobile";
export const SystemAuditDashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [latestBlock, setLatestBlock] = useState<Block | null>(null);
  const [lastVerified, setLastVerified] = useState<Date>(new Date());
  const {
    isMobile,
    isTablet
  } = useDeviceType();
  useEffect(() => {
    const fetchBlocks = () => {
      try {
        setIsLoading(true);
        // Get all blocks and sort by most recent
        const allBlocks = getAllBlocks().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
  return <Card className="shadow-sm">
      
      
      
      
      
    </Card>;
};