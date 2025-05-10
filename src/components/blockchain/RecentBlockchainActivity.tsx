
import React from 'react';
import { Block } from "@/utils/blockchainUtil";
import { Clock } from "lucide-react";

interface RecentBlockchainActivityProps {
  blocks: Block[];
  formatDate: (isoString: string, options?: Intl.DateTimeFormatOptions) => string;
}

export const RecentBlockchainActivity: React.FC<RecentBlockchainActivityProps> = ({
  blocks,
  formatDate
}) => {
  if (blocks.length === 0) return null;
  
  return (
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
  );
};
