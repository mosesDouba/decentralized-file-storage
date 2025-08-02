import { ethers } from "ethers";
import ContractABI from "../abis/FileRegistry.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Change if needed

export interface WalletConnection {
  signer: ethers.Signer;
  address: string;
  provider: ethers.BrowserProvider;
}

export interface BlockchainFile {
  fileName: string;
  cid1: string;
  cid2: string;
  cid3: string;
  owner: string;
  timestamp: number;
}

export class WalletService {
  
  /**
   * Connect to MetaMask wallet and get signer and address
   */
  static async connectWallet(): Promise<WalletConnection> {
    if (!window.ethereum) {
      throw new Error("You must install MetaMask first!");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return { signer, address, provider };
  }

  /**
   * Check if MetaMask is installed
   */
  static isMetaMaskInstalled(): boolean {
    return typeof window.ethereum !== 'undefined';
  }

  /**
   * Get the current account if already connected
   */
  static async getCurrentAccount(): Promise<string | null> {
    if (!window.ethereum) return null;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error('Error getting current account:', error);
      return null;
    }
  }

  /**
   * Store file data on the blockchain
   */
  static async storeFileOnBlockchain(
    fileName: string,
    cids: string[],
    walletConnection: WalletConnection
  ): Promise<string> {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, walletConnection.signer);

    const tx = await contract.storeFile(
      fileName,
      cids[0] || "",
      cids[1] || "",
      cids[2] || "",
      {
        value: ethers.parseEther("0.01"), // 0.01 ETH payment
      }
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }

  /**
   * Get all files from the blockchain
   */
  static async getAllFilesFromBlockchain(): Promise<BlockchainFile[]> {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, provider);

    try {
      const [fileNames, cid1s, cid2s, cid3s, owners, timestamps] = await contract.getAllFiles();
      
      const files: BlockchainFile[] = [];
      for (let i = 0; i < fileNames.length; i++) {
        files.push({
          fileName: fileNames[i],
          cid1: cid1s[i],
          cid2: cid2s[i], 
          cid3: cid3s[i],
          owner: owners[i],
          timestamp: Number(timestamps[i])
        });
      }
      
      return files;
    } catch (error) {
      console.error('Error fetching files from blockchain:', error);
      return [];
    }
  }

  /**
   * Get files count from blockchain
   */
  static async getFilesCount(): Promise<number> {
    if (!window.ethereum) return 0;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, provider);
      const count = await contract.getFilesCount();
      return Number(count);
    } catch (error) {
      console.error('Error getting files count:', error);
      return 0;
    }
  }
}

// Extend window type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
} 