'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { 
  type WalletType, 
  WALLET_ADAPTERS, 
  getWalletAdapter,
  COREUM_CHAIN_CONFIG 
} from '@/lib/wallet-adapters';

export type { WalletType } from '@/lib/wallet-adapters';

export interface DelegationInfo {
  address: string;
  shares: string;
  balance: {
    denom: string;
    amount: string;
  };
}

export interface RaceProfile {
  address: string;
  name: string | null;
  class: 'BABY' | 'TEEN' | 'ADULT';
  rank: number;
  percentile: string;
  score: string;
  isSleeping: boolean;
  daysAwake: number;
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletType: WalletType | null;
  delegation: DelegationInfo | null;
  raceProfile: RaceProfile | null;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshDelegation: () => Promise<void>;
  refreshRaceProfile: () => Promise<void>;
  // New: get available wallets
  availableWallets: Array<{ id: WalletType; name: string; installed: boolean }>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [delegation, setDelegation] = useState<DelegationInfo | null>(null);
  const [raceProfile, setRaceProfile] = useState<RaceProfile | null>(null);
  const [availableWallets, setAvailableWallets] = useState<Array<{ id: WalletType; name: string; installed: boolean }>>([]);

  // Check for available wallets on mount
  useEffect(() => {
    const wallets = Object.values(WALLET_ADAPTERS).map(adapter => ({
      id: adapter.id,
      name: adapter.name,
      installed: adapter.isInstalled(),
    }));
    setAvailableWallets(wallets);

    // Check for saved connection
    const savedAddress = localStorage.getItem('coreezy_wallet_address');
    const savedType = localStorage.getItem('coreezy_wallet_type') as WalletType;

    if (savedAddress && savedType) {
      reconnect(savedType, savedAddress);
    }
  }, []);

  const reconnect = async (type: WalletType, savedAddress: string) => {
    const adapter = getWalletAdapter(type);
    if (!adapter || !adapter.isInstalled()) {
      localStorage.removeItem('coreezy_wallet_address');
      localStorage.removeItem('coreezy_wallet_type');
      return;
    }

    try {
      const connectedAddress = await adapter.connect();

      if (connectedAddress === savedAddress) {
        setAddress(savedAddress);
        setWalletType(type);
        await fetchDelegation(savedAddress);
        await fetchRaceProfile(savedAddress);
        
        // Record site visit on reconnect
        try {
          await fetch('/api/race/site-visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: savedAddress }),
          });
        } catch (error) {
          console.error('Failed to record site visit:', error);
        }
      } else {
        // Address changed, clear saved
        localStorage.removeItem('coreezy_wallet_address');
        localStorage.removeItem('coreezy_wallet_type');
      }
    } catch (error) {
      console.error('Failed to reconnect:', error);
      localStorage.removeItem('coreezy_wallet_address');
      localStorage.removeItem('coreezy_wallet_type');
    }
  };

  const fetchDelegation = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/delegation?address=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setDelegation(data.delegation);
      } else {
        setDelegation(null);
      }
    } catch (error) {
      console.error('Failed to fetch delegation:', error);
      setDelegation(null);
    }
  };

  const fetchRaceProfile = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/race/profile/${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setRaceProfile(data.profile);
      } else {
        setRaceProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch race profile:', error);
      setRaceProfile(null);
    }
  };

  const connect = useCallback(async (type: WalletType) => {
    setIsConnecting(true);

    try {
      const adapter = getWalletAdapter(type);
      
      if (!adapter) {
        throw new Error(`Unknown wallet type: ${type}`);
      }

      if (!adapter.isInstalled()) {
        throw new Error(
          `${adapter.name} wallet not installed. Please install it from ${adapter.downloadUrl}`
        );
      }

      const walletAddress = await adapter.connect();
      
      setAddress(walletAddress);
      setWalletType(type);

      localStorage.setItem('coreezy_wallet_address', walletAddress);
      localStorage.setItem('coreezy_wallet_type', type);

      // Record site visit (also creates user/profile if new)
      try {
        await fetch('/api/race/site-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: walletAddress }),
        });
      } catch (error) {
        console.error('Failed to record site visit:', error);
      }

      // Fetch delegation and race profile
      await Promise.all([
        fetchDelegation(walletAddress),
        fetchRaceProfile(walletAddress),
      ]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletType(null);
    setDelegation(null);
    setRaceProfile(null);
    localStorage.removeItem('coreezy_wallet_address');
    localStorage.removeItem('coreezy_wallet_type');
  }, []);

  const refreshDelegation = useCallback(async () => {
    if (!address) return;
    await fetchDelegation(address);
  }, [address]);

  const refreshRaceProfile = useCallback(async () => {
    if (!address) return;
    await fetchRaceProfile(address);
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        walletType,
        delegation,
        raceProfile,
        connect,
        disconnect,
        refreshDelegation,
        refreshRaceProfile,
        availableWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
