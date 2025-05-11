
import React from 'react';
import { Block } from "@/utils/blockchain/types";
import { ShieldCheck, Shield } from "lucide-react";

interface BlockchainIntegrityStatsProps {
  isVerified: boolean | null;
  lastVerified: Date;
  latestBlock: Block | null;
  formatDate: (isoString: string, options?: Intl.DateTimeFormatOptions) => string;
}

export const BlockchainIntegrityStats: React.FC<BlockchainIntegrityStatsProps> = ({
  isVerified,
  lastVerified,
  latestBlock,
  formatDate
}) => {
  return (
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
  );
};
