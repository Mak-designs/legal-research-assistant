import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck } from "lucide-react";
interface TamperDetectionFormProps {
  documentName: string;
  setDocumentName: (value: string) => void;
  originalContent: string;
  setOriginalContent: (value: string) => void;
  currentContent: string;
  setCurrentContent: (value: string) => void;
  isVerifying: boolean;
  onVerify: () => void;
}
export const TamperDetectionForm: React.FC<TamperDetectionFormProps> = ({
  documentName,
  setDocumentName,
  originalContent,
  setOriginalContent,
  currentContent,
  setCurrentContent,
  isVerifying,
  onVerify
}) => {
  return <div className="space-y-4">
      
      
      <div>
        <label htmlFor="original-content" className="block text-sm font-medium mb-1">
          Original Document Content
        </label>
        <Textarea id="original-content" value={originalContent} onChange={e => setOriginalContent(e.target.value)} className="min-h-[150px] font-mono text-xs" placeholder="Paste the original document content here" />
      </div>
      
      <div>
        <label htmlFor="current-content" className="block text-sm font-medium mb-1">
          Current Document Content
        </label>
        <Textarea id="current-content" value={currentContent} onChange={e => setCurrentContent(e.target.value)} className="min-h-[150px] font-mono text-xs" placeholder="Paste the current document content to verify" />
      </div>
      
      <Button onClick={onVerify} disabled={isVerifying || !originalContent || !currentContent} className="w-full">
        {isVerifying ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
        Verify Document Integrity
      </Button>
    </div>;
};