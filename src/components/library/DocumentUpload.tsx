
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { FileText, Upload, FileDigit } from "lucide-react";

export const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    clientName: '',
    caseNumber: '',
    documentType: ''
  });
  const [hash, setHash] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setHash(null);
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const generateHash = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a document to generate a hash",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, you'd send the file to your backend
      // Here we're simulating the hash generation
      const arrayBuffer = await file.arrayBuffer();
      const hashArray = new Uint8Array(await crypto.subtle.digest('SHA-256', arrayBuffer));
      const hashHex = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      setHash(hashHex);
      
      toast({
        title: "Document fingerprint generated",
        description: "The document hash has been successfully calculated.",
      });
    } catch (error) {
      console.error("Error generating hash:", error);
      toast({
        title: "Hash generation failed",
        description: "There was an error generating the document fingerprint.",
        variant: "destructive"
      });
    }
  };

  const saveDocument = () => {
    if (!file || !hash) {
      toast({
        title: "Missing information",
        description: "Please select a file and generate a hash first",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically upload the document and its hash to your backend
    toast({
      title: "Document saved",
      description: `${file.name} has been added to the system with its integrity hash.`,
    });

    // Reset the form
    setFile(null);
    setHash(null);
    setMetadata({
      clientName: '',
      caseNumber: '',
      documentType: ''
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Document Upload & Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-md p-6 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            Drag and drop your legal document or click to browse
          </p>
          <Input
            id="document-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('document-upload')?.click()}
          >
            Select Document
          </Button>
          {file && (
            <p className="mt-2 text-sm bg-muted p-2 rounded">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input 
              id="clientName"
              name="clientName"
              value={metadata.clientName}
              onChange={handleMetadataChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caseNumber">Case Number</Label>
            <Input 
              id="caseNumber"
              name="caseNumber"
              value={metadata.caseNumber}
              onChange={handleMetadataChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Input 
              id="documentType"
              name="documentType"
              value={metadata.documentType}
              onChange={handleMetadataChange}
              placeholder="e.g., Motion, Brief, Contract, Evidence"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={generateHash} className="flex items-center w-full">
            <FileDigit className="mr-2 h-4 w-4" />
            Generate Document Fingerprint
          </Button>
        </div>

        {hash && (
          <div className="mt-4 bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Document Fingerprint (SHA-256)</h4>
            <p className="text-xs break-all font-mono bg-black text-white p-2 rounded">
              {hash}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Generated: {new Date().toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveDocument} 
          disabled={!file || !hash}
          className="w-full"
        >
          Save Document with Integrity Hash
        </Button>
      </CardFooter>
    </Card>
  );
};
