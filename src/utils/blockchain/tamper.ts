
/**
 * Document tampering detection functionality
 */
import { calculateHash } from './crypto';

/**
 * Detects tampering between original and current document content
 */
export const detectTampering = async (originalContent: string, currentContent: string): Promise<{
  tampered: boolean;
  originalHash: string;
  currentHash: string;
  match: boolean;
}> => {
  const originalHash = await calculateHash(originalContent);
  const currentHash = await calculateHash(currentContent);
  
  // Compare hashes to detect tampering
  const match = originalHash === currentHash;
  
  return {
    tampered: !match,
    originalHash,
    currentHash,
    match
  };
};

/**
 * Simple string difference detection for demonstration
 */
export const detectChanges = (originalContent: string, currentContent: string): string => {
  // In a real implementation, we would use a robust diff algorithm
  // For now, return a simplified representation of changes
  const lines1 = originalContent.split('\n');
  const lines2 = currentContent.split('\n');
  
  let result = '';
  
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';
    
    if (line1 !== line2) {
      result += `- ${line1}\n+ ${line2}\n`;
    } else {
      result += `  ${line1}\n`;
    }
  }
  
  return result;
};
