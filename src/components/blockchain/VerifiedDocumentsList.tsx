
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";

interface VerifiedDocument {
  documentId: string;
  documentName: string;
  verifiedAt: string;
}

interface VerifiedDocumentsListProps {
  documents: VerifiedDocument[];
  formatDate: (isoString: string) => string;
}

export const VerifiedDocumentsList: React.FC<VerifiedDocumentsListProps> = ({
  documents,
  formatDate
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <FileCheck className="h-4 w-4 mr-1" /> Your Verified Documents:
      </h3>
      
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc, index) => (
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
  );
};
