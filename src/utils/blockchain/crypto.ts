
/**
 * Cryptographic utilities for the blockchain
 */

/**
 * Calculates SHA-256 hash for a string
 */
export const calculateHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Calculates the hash for a block (simplified version)
 */
export const calculateBlockHash = (blockData: string): string => {
  // Simple hash function for demonstration
  // In production, use a proper crypto library or Web Crypto API as in calculateHash
  let hash = 0;
  for (let i = 0; i < blockData.length; i++) {
    const char = blockData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string with padding
  return hash.toString(16).padStart(64, '0');
};
