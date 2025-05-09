
/**
 * Blockchain Utility for Legal Research Audit Trails
 * 
 * This module provides functionality for creating and verifying
 * a blockchain-based immutable audit trail for legal documents.
 */

// Block structure for the blockchain
export type Block = {
  index: number;
  timestamp: string;
  data: AuditEvent;
  previousHash: string;
  hash: string;
  nonce: number;
};

// Audit event types
export type AuditEventType = 
  | 'DOCUMENT_CREATED'
  | 'DOCUMENT_EDITED'
  | 'DOCUMENT_REVIEWED'
  | 'DOCUMENT_SIGNED'
  | 'DOCUMENT_FINALIZED'
  | 'DOCUMENT_EXPORTED'
  | 'DOCUMENT_VERIFIED'
  | 'DOCUMENT_MODIFIED'
  | 'USER_LOGIN'
  | 'SEARCH_PERFORMED'
  | 'SYSTEM_BACKUP';

// Structure for audit events
export type AuditEvent = {
  type: AuditEventType;
  documentId?: string;
  documentName?: string;
  userId: string;
  userEmail: string;
  details?: string;
  metadata?: Record<string, any>;
};

// Mock blockchain storage - in a real app this would be persisted to a database
let blockchain: Block[] = [];

// Difficulty for proof of work (number of leading zeros required)
const DIFFICULTY = 2;

/**
 * Creates the genesis block for the blockchain
 */
export const createGenesisBlock = (): Block => {
  const genesisData: AuditEvent = {
    type: 'SYSTEM_BACKUP',
    userId: 'system',
    userEmail: 'system@legalresearch.app',
    details: 'Blockchain initialized'
  };
  
  const block: Block = {
    index: 0,
    timestamp: new Date().toISOString(),
    data: genesisData,
    previousHash: '0',
    hash: '',
    nonce: 0
  };
  
  // Calculate proper hash with proof of work
  block.hash = calculateBlockHash(block);
  
  return block;
};

/**
 * Initializes the blockchain if it doesn't exist
 */
export const initBlockchain = (): void => {
  if (blockchain.length === 0) {
    blockchain.push(createGenesisBlock());
  }
};

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
 * Calculates the hash for a block
 */
export const calculateBlockHash = (block: Block): string => {
  // In a real implementation, we would use async/await with proper crypto
  // For this example, we'll use a simulated hash
  const blockData = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    data: block.data,
    previousHash: block.previousHash,
    nonce: block.nonce
  });
  
  // Simple hash function for demonstration
  // In production, use a proper crypto library or Web Crypto API as in calculateHash
  let hash = 0;
  for (let i = 0; i < blockData.length; i++) {
    const char = blockData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string with padding for leading zeros based on difficulty
  return hash.toString(16).padStart(64, '0');
};

/**
 * Performs proof of work - adjusts nonce until hash meets difficulty requirement
 */
export const mineBlock = (block: Block): Block => {
  const target = Array(DIFFICULTY + 1).join('0');
  
  while (block.hash.substring(0, DIFFICULTY) !== target) {
    block.nonce++;
    block.hash = calculateBlockHash(block);
  }
  
  return block;
};

/**
 * Adds a new block to the blockchain
 */
export const addBlock = (data: AuditEvent): Block => {
  initBlockchain();
  
  const latestBlock = getLatestBlock();
  const newBlock: Block = {
    index: latestBlock.index + 1,
    timestamp: new Date().toISOString(),
    data: data,
    previousHash: latestBlock.hash,
    hash: '',
    nonce: 0
  };
  
  // Mine the block to get a valid hash
  const minedBlock = mineBlock(newBlock);
  blockchain.push(minedBlock);
  
  return minedBlock;
};

/**
 * Gets the latest block in the blockchain
 */
export const getLatestBlock = (): Block => {
  initBlockchain();
  return blockchain[blockchain.length - 1];
};

/**
 * Verifies the integrity of the entire blockchain
 */
export const verifyBlockchain = (): { valid: boolean; invalidBlocks: number[] } => {
  const invalidBlocks: number[] = [];
  
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];
    
    // Check hash link integrity
    if (currentBlock.previousHash !== previousBlock.hash) {
      invalidBlocks.push(i);
      continue;
    }
    
    // Verify current block's hash
    if (calculateBlockHash(currentBlock) !== currentBlock.hash) {
      invalidBlocks.push(i);
    }
  }
  
  return { 
    valid: invalidBlocks.length === 0,
    invalidBlocks 
  };
};

/**
 * Gets all blocks in the blockchain
 */
export const getAllBlocks = (): Block[] => {
  initBlockchain();
  return [...blockchain];
};

/**
 * Gets all blocks related to a specific document
 */
export const getDocumentBlocks = (documentId: string): Block[] => {
  initBlockchain();
  return blockchain.filter(block => block.data.documentId === documentId);
};

/**
 * Records a document event in the blockchain
 */
export const recordDocumentEvent = (
  eventType: AuditEventType,
  documentId: string,
  documentName: string,
  userId: string,
  userEmail: string,
  details?: string,
  metadata?: Record<string, any>
): Block => {
  const eventData: AuditEvent = {
    type: eventType,
    documentId,
    documentName,
    userId,
    userEmail,
    details,
    metadata
  };
  
  return addBlock(eventData);
};

/**
 * Records a system event in the blockchain
 */
export const recordSystemEvent = (
  eventType: AuditEventType,
  userId: string,
  userEmail: string,
  details?: string,
  metadata?: Record<string, any>
): Block => {
  const eventData: AuditEvent = {
    type: eventType,
    userId,
    userEmail,
    details,
    metadata
  };
  
  return addBlock(eventData);
};

/**
 * Generates an audit certificate for a document
 */
export const generateAuditCertificate = async (documentId: string, documentContent: string): Promise<{
  documentId: string;
  documentHash: string;
  blockCount: number;
  certificateHash: string;
  merkleRoot: string;
  timestamp: string;
  registrationId: string;
}> => {
  // Get all blocks for this document
  const documentBlocks = getDocumentBlocks(documentId);
  
  // Calculate document hash
  const documentHash = await calculateHash(documentContent);
  
  // In a production system, we would calculate a true Merkle root
  // For this example, we'll create a simulated one
  const blockHashes = documentBlocks.map(block => block.hash);
  const combinedHashes = blockHashes.join('');
  const merkleRoot = await calculateHash(combinedHashes);
  
  // Generate a certificate hash from document hash and merkle root
  const certificateHash = await calculateHash(documentHash + merkleRoot);
  
  // Generate a unique registration ID
  const timestamp = new Date();
  const registrationId = `LRAC-${timestamp.getFullYear()}-${
    String(timestamp.getMonth() + 1).padStart(2, '0')
  }-${
    String(timestamp.getDate()).padStart(2, '0')
  }-${
    documentBlocks.length
  }`;
  
  return {
    documentId,
    documentHash,
    blockCount: documentBlocks.length,
    certificateHash,
    merkleRoot,
    timestamp: timestamp.toISOString(),
    registrationId
  };
};

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

// Initialize blockchain with genesis block
initBlockchain();

// Add some sample audit events for demonstration
// In a real application, these would be triggered by actual user actions
if (blockchain.length <= 1) {
  recordDocumentEvent(
    'DOCUMENT_CREATED', 
    'SMITH2025-BRIEF-01',
    'Smith v. Jones - Case Brief',
    'sarah-johnson',
    'sarah.johnson@lawfirm.com',
    'Initial draft created'
  );
  
  recordDocumentEvent(
    'DOCUMENT_EDITED', 
    'SMITH2025-BRIEF-01',
    'Smith v. Jones - Case Brief',
    'michael-wilson',
    'michael.wilson@lawfirm.com',
    'Added case citations and legal analysis'
  );
  
  recordDocumentEvent(
    'DOCUMENT_REVIEWED', 
    'SMITH2025-BRIEF-01',
    'Smith v. Jones - Case Brief',
    'partner-rodriguez',
    'partner.rodriguez@lawfirm.com',
    'Senior review completed - approved with minor changes'
  );
  
  recordSystemEvent(
    'USER_LOGIN',
    'sarah-johnson',
    'sarah.johnson@lawfirm.com',
    'Login from IP 192.168.1.105'
  );
  
  recordDocumentEvent(
    'DOCUMENT_FINALIZED', 
    'SMITH2025-BRIEF-01',
    'Smith v. Jones - Case Brief',
    'sarah-johnson',
    'sarah.johnson@lawfirm.com',
    'Document marked as final version'
  );
  
  recordDocumentEvent(
    'DOCUMENT_EXPORTED', 
    'SMITH2025-BRIEF-01',
    'Smith v. Jones - Case Brief',
    'admin',
    'admin@lawfirm.com',
    'Document exported to PDF'
  );
  
  recordSystemEvent(
    'SEARCH_PERFORMED',
    'sarah-johnson',
    'sarah.johnson@lawfirm.com',
    'Search query: "precedent negligence medical"'
  );
  
  recordDocumentEvent(
    'DOCUMENT_CREATED', 
    'SMITH2025-MOTION-03',
    'Smith v. Jones - Motion to Dismiss',
    'sarah-johnson',
    'sarah.johnson@lawfirm.com',
    'Created motion document'
  );
}
