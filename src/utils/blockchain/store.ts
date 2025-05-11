
/**
 * Blockchain data storage
 */
import { Block } from './types';

// Mock blockchain storage - in a real app this would be persisted to a database
let blockchain: Block[] = [];

/**
 * Gets all blocks in the blockchain
 */
export const getAllBlocks = (): Block[] => {
  return [...blockchain];
};

/**
 * Gets the latest block in the blockchain
 */
export const getLatestBlock = (): Block => {
  return blockchain[blockchain.length - 1];
};

/**
 * Gets all blocks related to a specific document
 */
export const getDocumentBlocks = (documentId: string): Block[] => {
  return blockchain.filter(block => block.data.documentId === documentId);
};

/**
 * Adds a block to the blockchain
 */
export const addBlock = (block: Block): void => {
  blockchain.push(block);
};

/**
 * Sets the entire blockchain (used for initialization)
 */
export const setBlockchain = (newBlockchain: Block[]): void => {
  blockchain = newBlockchain;
};
