
/**
 * Core blockchain data types
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
