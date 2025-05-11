
/**
 * Blockchain Utility for Legal Research Audit Trails
 * 
 * This module provides functionality for creating and verifying
 * a blockchain-based immutable audit trail for legal documents.
 */

// Re-export all types and functions from submodules
export * from './types';
export * from './store';
export * from './crypto';
export * from './mining';
export * from './core';
export * from './audit';
export * from './tamper';

// Import necessary functions to initialize sample data
import { getAllBlocks } from './store';
import { initBlockchain } from './core';
import { recordDocumentEvent, recordSystemEvent } from './audit';

// Initialize blockchain with genesis block
initBlockchain();

// Add some sample audit events for demonstration
// In a real application, these would be triggered by actual user actions
if (getAllBlocks().length <= 1) {
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
