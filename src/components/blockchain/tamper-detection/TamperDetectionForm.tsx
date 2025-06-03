
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TamperDetectionFormProps {
  documentName: string;
  setDocumentName: (value: string) => void;
  originalFile: File | null;
  currentFile: File | null;
  isVerifying: boolean;
  onVerify: () => void;
  onOriginalFileUpload: (file: File) => void;
  onCurrentFileUpload: (file: File) => void;
}

export const TamperDetectionForm: React.FC<TamperDetectionFormProps> = ({
  documentName,
  setDocumentName,
  originalFile,
  currentFile,
  isVerifying,
  onVerify,
  onOriginalFileUpload,
  onCurrentFileUpload,
}) => {
  const handleOriginalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onOriginalFileUpload(file);
    }
  };

  const handleCurrentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCurrentFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="document-name" className="block text-sm font-medium mb-2">
          Document Name
        </label>
        <Input
          id="document-name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Enter document name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-medium mb-1">📂 Upload Original Document</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the verified original document
                </p>
              </div>
              
              <Input
                type="file"
                onChange={handleOriginalFileChange}
                accept=".txt,.pdf,.doc,.docx"
                className="cursor-pointer"
              />
              
              {originalFile && (
                <div className="flex items-center justify-center space-x-2 mt-2 p-2 bg-green-50 rounded text-sm">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">{originalFile.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-medium mb-1">📂 Upload Current Document</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the document to verify
                </p>
              </div>
              
              <Input
                type="file"
                onChange={handleCurrentFileChange}
                accept=".txt,.pdf,.doc,.docx"
                className="cursor-pointer"
              />
              
              {currentFile && (
                <div className="flex items-center justify-center space-x-2 mt-2 p-2 bg-blue-50 rounded text-sm">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">{currentFile.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={onVerify} 
        disabled={isVerifying || !originalFile || !currentFile}
        className="w-full h-12 text-base"
        size="lg"
      >
        {isVerifying ? (
          <Clock className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <ShieldCheck className="h-5 w-5 mr-2" />
        )}
        🔘 Verify Document Integrity
      </Button>
    </div>
  );
};
