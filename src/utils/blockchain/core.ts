
/**
 * Core blockchain functionality
 */
import { Block, AuditEvent } from './types';
import { getAllBlocks, getLatestBlock, addBlock as storeBlock } from './store';
import { getBlockHash, mineBlock } from './mining';

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
  block.hash = getBlockHash(block);
  
  return block;
};

/**
 * Initializes the blockchain if it doesn't exist
 */
export const initBlockchain = (): void => {
  if (getAllBlocks().length === 0) {
    storeBlock(createGenesisBlock());
  }
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
  storeBlock(minedBlock);
  
  return minedBlock;
};
