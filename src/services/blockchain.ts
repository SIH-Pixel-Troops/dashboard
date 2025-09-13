import { ethers } from 'ethers';

// Blockchain configuration
export const blockchainConfig = {
  rpcUrl: process.env.REACT_APP_ALCHEMY_RPC,
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
  network: process.env.REACT_APP_BLOCKCHAIN_NETWORK || 'sepolia',
  enabled: process.env.REACT_APP_ENABLE_BLOCKCHAIN === 'true',
};

// Contract ABI (you'll need to replace this with your actual contract ABI)
export const contractABI = [
  // Tourist registration
  "function registerTourist(string memory digitalId, string memory name, string memory emergencyContact) public returns (uint256)",
  
  // Tourist verification
  "function verifyTourist(string memory digitalId) public view returns (bool, uint256, string memory)",
  
  // Update tourist status
  "function updateTouristStatus(string memory digitalId, uint8 status, string memory location) public",
  
  // Get tourist information
  "function getTouristInfo(string memory digitalId) public view returns (string memory, uint8, string memory, uint256)",
  
  // Emergency alert
  "function triggerEmergencyAlert(string memory digitalId, string memory alertType, string memory message) public",
  
  // Events
  "event TouristRegistered(string digitalId, uint256 timestamp)",
  "event TouristStatusUpdated(string digitalId, uint8 status, uint256 timestamp)",
  "event EmergencyAlertTriggered(string digitalId, string alertType, uint256 timestamp)"
];

// Blockchain service for interacting with smart contracts
export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (blockchainConfig.enabled && blockchainConfig.rpcUrl) {
      this.initializeProvider();
    }
  }

  private initializeProvider() {
    try {
      this.provider = new ethers.providers.JsonRpcProvider(blockchainConfig.rpcUrl);
      
      if (blockchainConfig.contractAddress) {
        this.contract = new ethers.Contract(
          blockchainConfig.contractAddress,
          contractABI,
          this.provider
        );
      }
    } catch (error) {
      console.error('Failed to initialize blockchain provider:', error);
    }
  }

  // Verify tourist identity on blockchain
  async verifyTouristIdentity(digitalId: string): Promise<{
    isValid: boolean;
    timestamp: number;
    name: string;
  }> {
    if (!this.contract) {
      throw new Error('Blockchain not initialized');
    }

    try {
      const [isValid, timestamp, name] = await this.contract.verifyTourist(digitalId);
      return {
        isValid,
        timestamp: timestamp.toNumber(),
        name,
      };
    } catch (error) {
      console.error('Error verifying tourist identity:', error);
      throw error;
    }
  }

  // Get tourist information from blockchain
  async getTouristInfo(digitalId: string): Promise<{
    name: string;
    status: number;
    location: string;
    lastUpdate: number;
  }> {
    if (!this.contract) {
      throw new Error('Blockchain not initialized');
    }

    try {
      const [name, status, location, lastUpdate] = await this.contract.getTouristInfo(digitalId);
      return {
        name,
        status,
        location,
        lastUpdate: lastUpdate.toNumber(),
      };
    } catch (error) {
      console.error('Error getting tourist info:', error);
      throw error;
    }
  }

  // Listen for blockchain events
  listenForEvents(callback: (event: any) => void) {
    if (!this.contract) {
      console.warn('Blockchain not initialized, cannot listen for events');
      return;
    }

    // Listen for tourist registration events
    this.contract.on('TouristRegistered', (digitalId: string, timestamp: any, event: any) => {
      callback({
        type: 'TouristRegistered',
        digitalId,
        timestamp: timestamp.toNumber(),
        event,
      });
    });

    // Listen for status update events
    this.contract.on('TouristStatusUpdated', (digitalId: string, status: any, timestamp: any, event: any) => {
      callback({
        type: 'TouristStatusUpdated',
        digitalId,
        status,
        timestamp: timestamp.toNumber(),
        event,
      });
    });

    // Listen for emergency alert events
    this.contract.on('EmergencyAlertTriggered', (digitalId: string, alertType: string, timestamp: any, event: any) => {
      callback({
        type: 'EmergencyAlertTriggered',
        digitalId,
        alertType,
        timestamp: timestamp.toNumber(),
        event,
      });
    });
  }

  // Stop listening for events
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }

  // Get current block number
  async getCurrentBlock(): Promise<number> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return await this.provider.getBlockNumber();
  }

  // Get network information
  async getNetworkInfo(): Promise<ethers.providers.Network> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return await this.provider.getNetwork();
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
