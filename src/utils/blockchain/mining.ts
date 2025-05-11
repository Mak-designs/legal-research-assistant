
/**
 * Block mining and verification utilities
 */
import { Block } from './types';
import { calculateBlockHash } from './crypto';

// Difficulty for proof of work (number of leading zeros required)
const DIFFICULTY = 2;

/**
 * Calculates a hash for a specific block
 */
export const getBlockHash = (block: Block): string => {
  const blockData = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    data: block.data,
    previousHash: block.previousHash,
    nonce: block.nonce
  });
  
  return calculateBlockHash(blockData);
};

/**
 * Performs proof of work - adjusts nonce until hash meets difficulty requirement
 */
export const mineBlock = (block: Block): Block => {
  const target = Array(DIFFICULTY + 1).join('0');
  
  while (block.hash.substring(0, DIFFICULTY) !== target) {
    block.nonce++;
    block.hash = getBlockHash(block);
  }
  
  return block;
};

/**
 * Verifies the integrity of the entire blockchain
 */
export const verifyBlockchain = (blockchain: Block[]): { valid: boolean; invalidBlocks: number[] } => {
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
    if (getBlockHash(currentBlock) !== currentBlock.hash) {
      invalidBlocks.push(i);
    }
  }
  
  return { 
    valid: invalidBlocks.length === 0,
    invalidBlocks 
  };
};
