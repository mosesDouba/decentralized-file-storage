import { useState, useEffect } from 'react';
import { WalletService, WalletConnection } from '@/services/wallet';
import { useToast } from '@/hooks/use-toast';

export interface UseWalletReturn {
  isConnected: boolean;
  account: string | null;
  walletConnection: WalletConnection | null;
  isMetaMaskInstalled: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  storeFileOnBlockchain: (fileName: string, cids: string[]) => Promise<string>;
}

export const useWallet = (): UseWalletReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
  const { toast } = useToast();

  const isMetaMaskInstalled = WalletService.isMetaMaskInstalled();

  // Check if already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    try {
      const currentAccount = await WalletService.getCurrentAccount();
      if (currentAccount) {
        setAccount(currentAccount);
        setIsConnected(true);
        // Don't auto-connect the full wallet connection to avoid unnecessary provider requests
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      const connection = await WalletService.connectWallet();
      setWalletConnection(connection);
      setAccount(connection.address);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${connection.address.slice(0, 6)}...${connection.address.slice(-4)}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const disconnect = () => {
    setWalletConnection(null);
    setAccount(null);
    setIsConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const storeFileOnBlockchain = async (fileName: string, cids: string[]): Promise<string> => {
    if (!walletConnection) {
      throw new Error('Wallet not connected');
    }

    try {
      const txHash = await WalletService.storeFileOnBlockchain(fileName, cids, walletConnection);
      toast({
        title: "Blockchain Registration Complete",
        description: `File registered with transaction: ${txHash.slice(0, 10)}...`,
      });
      return txHash;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register on blockchain';
      toast({
        title: "Blockchain Registration Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    isConnected,
    account,
    walletConnection,
    isMetaMaskInstalled,
    connectWallet,
    disconnect,
    storeFileOnBlockchain
  };
}; 