
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { detectTampering } from "@/utils/blockchainUtil";

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
  }[];
  timestamp?: string;
  lastAccess?: {
    date: string;
    user: string;
  };
};

export function useTamperDetection() {
  const [originalContent, setOriginalContent] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [documentName, setDocumentName] = useState("Smith v. Acme - Settlement Agreement.pdf");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!originalContent || !currentContent) {
      toast.error("Please enter both original and current content to verify");
      return;
    }
    
    try {
      setIsVerifying(true);
      
      const result = await detectTampering(originalContent, currentContent);
      
      // In a real application, we'd use more sophisticated diff algorithms
      // to identify specific sections that were modified
      const mockSections = result.tampered ? identifyChanges(originalContent, currentContent) : [];
      
      setVerificationResult({
        ...result,
        sections: mockSections,
        timestamp: new Date().toISOString(),
        lastAccess: {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user: "user@example.com"
        }
      });
      
      if (result.match) {
        toast.success("Document verified successfully!");
      } else {
        toast.error("Document has been modified! Tampering detected.");
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // A simple string difference detector
  const identifyChanges = (original: string, current: string): {
    name: string;
    original: string;
    current: string;
  }[] => {
    const changes = [];
    
    // In a real implementation, we'd use a more sophisticated diff algorithm
    // Here we'll use some basic checks for demonstration
    
    // Check for amount changes
    if (original.includes("$500,000") && current.includes("$550,000")) {
      changes.push({
        name: "Section 1: Settlement Payment amount has been altered",
        original: "Five Hundred Thousand Dollars ($500,000)",
        current: "Five Hundred Fifty Thousand Dollars ($550,000)"
      });
    }
    
    // Check for date changes
    if (original.includes("April 15, 2025") && current.includes("April 16, 2025")) {
      changes.push({
        name: "First paragraph: Date has been altered",
        original: "April 15, 2025",
        current: "April 16, 2025"
      });
    }
    
    // If no specific changes detected but hashes don't match, likely whitespace changes
    if (changes.length === 0) {
      changes.push({
        name: "Whitespace changes detected",
        original: "Original formatting",
        current: "Modified formatting or invisible characters"
      });
    }
    
    return changes;
  };

  const handleReset = () => {
    setVerificationResult(null);
  };

  return {
    originalContent,
    setOriginalContent,
    currentContent,
    setCurrentContent,
    documentName,
    setDocumentName,
    isVerifying,
    verificationResult,
    handleVerify,
    handleReset
  };
}
