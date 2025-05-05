
/**
 * Digital Signature Utilities
 * 
 * This module provides cryptographic functions for creating and verifying
 * digital signatures in the legal research assistant.
 */

/**
 * Generates a hash for the provided content
 * @param content Document content to hash
 */
export const generateHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Mock user certificates for demonstration purposes
export type Certificate = {
  id: string;
  name: string;
  role: string;
  barNumber?: string;
  issued: string;
  expires: string;
  status: 'valid' | 'expired' | 'revoked';
  publicKey: string;
};

export const mockCertificates: Record<string, Certificate> = {
  'cert-1': {
    id: 'cert-1',
    name: 'Sarah Johnson',
    role: 'Attorney',
    barNumber: '12345',
    issued: '2023-10-15',
    expires: '2025-10-15',
    status: 'valid',
    publicKey: '3081890281810...'
  },
  'cert-2': {
    id: 'cert-2',
    name: 'Michael Wilson',
    role: 'Partner',
    barNumber: '67890',
    issued: '2024-02-28',
    expires: '2026-02-28',
    status: 'valid',
    publicKey: '3081890281811...'
  },
};

// Types for digital signatures
export type DigitalSignature = {
  id: string;
  documentId: string;
  documentHash: string;
  signatoryId: string;
  signatoryName: string;
  signatoryRole: string;
  certificateId: string;
  timestamp: string;
  signatureValue: string; // This would be the actual cryptographic signature in a real implementation
};

// Mock storage for signatures
const signatureStore: DigitalSignature[] = [];

/**
 * Signs a document with the provided certificate
 */
export const signDocument = async (
  documentId: string,
  documentContent: string,
  certificateId: string
): Promise<DigitalSignature> => {
  const certificate = mockCertificates[certificateId];
  if (!certificate) {
    throw new Error('Certificate not found');
  }
  
  if (certificate.status !== 'valid') {
    throw new Error('Certificate is not valid');
  }
  
  const documentHash = await generateHash(documentContent);
  
  // In a real application, we would use the private key to create a cryptographic signature
  // Here we're just simulating the signature by creating a hash of the content and certificate
  const signatureValue = await generateHash(documentHash + certificate.publicKey);
  
  const signature: DigitalSignature = {
    id: `sig-${Date.now()}`,
    documentId,
    documentHash,
    signatoryId: certificateId,
    signatoryName: certificate.name,
    signatoryRole: certificate.role,
    certificateId: certificate.id,
    timestamp: new Date().toISOString(),
    signatureValue
  };
  
  signatureStore.push(signature);
  return signature;
};

/**
 * Verifies a document signature
 */
export const verifySignature = async (
  documentId: string, 
  documentContent: string
): Promise<{
  verified: boolean;
  signatures: Array<{
    signatoryName: string;
    signatoryRole: string;
    timestamp: string;
    verified: boolean;
  }>;
}> => {
  const documentHash = await generateHash(documentContent);
  const documentSignatures = signatureStore.filter(sig => sig.documentId === documentId);
  
  if (documentSignatures.length === 0) {
    return {
      verified: false,
      signatures: []
    };
  }
  
  const verificationResults = documentSignatures.map(signature => {
    // In a real app, we would use the public key to verify the cryptographic signature
    // Here we're simulating by comparing the document hash
    const verified = signature.documentHash === documentHash;
    
    return {
      signatoryName: signature.signatoryName,
      signatoryRole: signature.signatoryRole,
      timestamp: signature.timestamp,
      verified
    };
  });
  
  return {
    verified: verificationResults.every(result => result.verified),
    signatures: verificationResults
  };
};

/**
 * Gets all signatures for a document
 */
export const getDocumentSignatures = (documentId: string): DigitalSignature[] => {
  return signatureStore.filter(sig => sig.documentId === documentId);
};

/**
 * Gets all certificates
 */
export const getCertificates = (): Certificate[] => {
  return Object.values(mockCertificates);
};

/**
 * Get a certificate by ID
 */
export const getCertificate = (id: string): Certificate | undefined => {
  return mockCertificates[id];
};
