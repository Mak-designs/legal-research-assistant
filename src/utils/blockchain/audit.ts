
/**
 * Document audit functionality
 */
import { AuditEvent, AuditEventType } from './types';
import { addBlock } from './core';
import { calculateHash } from './crypto';
import { getDocumentBlocks } from './store';

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
): ReturnType<typeof addBlock> => {
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
): ReturnType<typeof addBlock> => {
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
