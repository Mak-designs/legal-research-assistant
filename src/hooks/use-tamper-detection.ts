
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { detectTampering } from "@/utils/blockchain";
import { diffWords } from "diff";

export type VerificationResult = {
  tampered: boolean;
  originalHash: string;
  currentHash: string;
  match: boolean;
  diff?: string;
  sections?: {
    name: string;
    original: string;
    current: string;
    type: 'added' | 'removed' | 'modified';
  }[];
  timestamp?: string;
  lastAccess?: {
    date: string;
    user: string;
  };
  severity?: 'none' | 'low' | 'high';
  summary?: string;
};

export function useTamperDetection() {
  const [originalContent, setOriginalContent] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Extract text content from file
  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }, []);

  const handleOriginalFileUpload = useCallback(async (file: File) => {
    setOriginalFile(file);
    if (!documentName) {
      setDocumentName(file.name);
    }
    try {
      const content = await extractTextFromFile(file);
      setOriginalContent(content);
    } catch (error) {
      console.error("Error reading original file:", error);
      toast.error("Failed to read original document");
    }
  }, [documentName, extractTextFromFile]);

  const handleCurrentFileUpload = useCallback(async (file: File) => {
    setCurrentFile(file);
    try {
      const content = await extractTextFromFile(file);
      setCurrentContent(content);
    } catch (error) {
      console.error("Error reading current file:", error);
      toast.error("Failed to read current document");
    }
  }, [extractTextFromFile]);

  const identifyChanges = useCallback((original: string, current: string): {
    name: string;
    original: string;
    current: string;
    type: 'added' | 'removed' | 'modified';
  }[] => {
    const diffs = diffWords(original, current);
    const changes: {
      name: string;
      original: string;
      current: string;
      type: 'added' | 'removed' | 'modified';
    }[] = [];

    let changeIndex = 1;
    let currentChange: { removed?: string; added?: string } = {};

    diffs.forEach((part) => {
      if (part.removed) {
        currentChange.removed = part.value;
      } else if (part.added) {
        currentChange.added = part.value;
        
        // Create change entry
        changes.push({
          name: `Change ${changeIndex++}`,
          original: currentChange.removed || "",
          current: part.value,
          type: currentChange.removed ? 'modified' : 'added'
        });
        
        currentChange = {};
      } else if (currentChange.removed) {
        // Removed text without replacement
        changes.push({
          name: `Change ${changeIndex++}`,
          original: currentChange.removed,
          current: "",
          type: 'removed'
        });
        
        currentChange = {};
      }
    });

    // Handle any remaining removed text
    if (currentChange.removed) {
      changes.push({
        name: `Change ${changeIndex}`,
        original: currentChange.removed,
        current: "",
        type: 'removed'
      });
    }

    if (changes.length === 0) {
      changes.push({
        name: "Whitespace or invisible character changes detected",
        original: "No visible content difference",
        current: "Possible formatting changes",
        type: 'modified'
      });
    }

    return changes;
  }, []);

  const handleVerify = async () => {
    if (!originalContent || !currentContent) {
      toast.error("Please upload both the original and current document to start verification.");
      return;
    }
    
    try {
      setIsVerifying(true);
      
      const result = await detectTampering(originalContent, currentContent);
      
      const sections = result.tampered ? identifyChanges(originalContent, currentContent) : [];
      
      // Determine severity
      const severity = result.tampered 
        ? sections.length >= 3 ? 'high' : 'low'
        : 'none';
      
      // Create summary
      const summary = result.tampered
        ? `${sections.length} change(s) found in document`
        : "No changes detected";
      
      setVerificationResult({
        ...result,
        sections,
        severity,
        summary,
        timestamp: new Date().toISOString(),
        lastAccess: {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user: "user@example.com"
        }
      });
      
      if (result.match) {
        toast.success("No changes detected. Document is authentic.");
      } else {
        toast.error("⚠ Document tampered! Differences found.");
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = useCallback(() => {
    setVerificationResult(null);
    setOriginalFile(null);
    setCurrentFile(null);
    setOriginalContent("");
    setCurrentContent("");
    setDocumentName("");
  }, []);

  // Load verified document as original
  const loadVerifiedDocument = useCallback((documentContent: string, documentFileName: string) => {
    setOriginalContent(documentContent);
    setDocumentName(documentFileName);
    toast.info("Verified document loaded as original");
  }, []);

  return {
    originalContent,
    setOriginalContent,
    currentContent,
    setCurrentContent,
    originalFile,
    currentFile,
    documentName,
    setDocumentName,
    isVerifying,
    verificationResult,
    handleVerify,
    handleReset,
    handleOriginalFileUpload,
    handleCurrentFileUpload,
    loadVerifiedDocument
  };
}
