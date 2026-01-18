'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { 
  type WalletType, 
  WALLET_ADAPTERS, 
  getWalletAdapter,
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
  availableWallets: Array<{ id: WalletType; name: string; installed: boolean }>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Storage keys
const STORAGE_ADDRESS_KEY = 'coreezy_wallet_address';
const STORAGE_TYPE_KEY = 'coreezy_wallet_type';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [delegation, setDelegation] = useState<DelegationInfo | null>(null);
  const [raceProfile, setRaceProfile] = useState<RaceProfile | null>(null);
  const [availableWallets, setAvailableWallets] = useState<Array<{ id: WalletType; name: string; installed: boolean }>>([]);
  
  const hasAttemptedReconnect = useRef(false);

  // Fetch delegation info
  const fetchDelegation = useCallback(async (walletAddress: string) => {
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
  }, []);

  // Fetch race profile
  const fetchRaceProfile = useCallback(async (walletAddress: string) => {
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
  }, []);

  // Record site visit
  const recordSiteVisit = useCallback(async (walletAddress: string) => {
    try {
      await fetch('/api/race/site-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress }),
      });
    } catch (error) {
      console.error('Failed to record site visit:', error);
    }
  }, []);

  // Reconnect to saved wallet
  const reconnect = useCallback(async (type: WalletType, savedAddress: string) => {
    const adapter = getWalletAdapter(type);
    if (!adapter) {
      console.log('[Wallet] Unknown wallet type:', type);
      return false;
    }

    // Wait for wallet extension to be available (max 3 seconds)
    let attempts = 0;
    while (!adapter.isInstalled() && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!adapter.isInstalled()) {
      console.log('[Wallet] Wallet not installed:', type);
      localStorage.removeItem(STORAGE_ADDRESS_KEY);
      localStorage.removeItem(STORAGE_TYPE_KEY);
      return false;
    }

    try {
      console.log('[Wallet] Attempting reconnect to', type);
      const connectedAddress = await adapter.connect();

      if (connectedAddress === savedAddress) {
        console.log('[Wallet] Reconnected successfully:', savedAddress);
        setAddress(savedAddress);
        setWalletType(type);
        
        // Fetch data in parallel
        await Promise.all([
          fetchDelegation(savedAddress),
          fetchRaceProfile(savedAddress),
          recordSiteVisit(savedAddress),
        ]);
        
        return true;
      } else {
        console.log('[Wallet] Address mismatch, clearing saved state');
        localStorage.removeItem(STORAGE_ADDRESS_KEY);
        localStorage.removeItem(STORAGE_TYPE_KEY);
        return false;
      }
    } catch (error) {
      console.error('[Wallet] Reconnect failed:', error);
      // Don't clear storage on error - user might need to approve in wallet
      return false;
    }
  }, [fetchDelegation, fetchRaceProfile, recordSiteVisit]);

  // Initialize: check for saved connection and available wallets
  useEffect(() => {
    // Update available wallets list
    const updateAvailableWallets = () => {
      const wallets = Object.values(WALLET_ADAPTERS).map(adapter => ({
        id: adapter.id,
        name: adapter.name,
        installed: adapter.isInstalled(),
      }));
      setAvailableWallets(wallets);
    };

    // Initial check
    updateAvailableWallets();

    // Check for saved connection
    const savedAddress = localStorage.getItem(STORAGE_ADDRESS_KEY);
    const savedType = localStorage.getItem(STORAGE_TYPE_KEY) as WalletType;

    if (savedAddress && savedType && !hasAttemptedReconnect.current) {
      hasAttemptedReconnect.current = true;
      
      // Small delay to let wallet extensions initialize
      const timer = setTimeout(() => {
        reconnect(savedType, savedAddress);
        // Update available wallets after reconnect attempt
        updateAvailableWallets();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [reconnect]);

  // Connect to a wallet
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

      // Save to localStorage
      localStorage.setItem(STORAGE_ADDRESS_KEY, walletAddress);
      localStorage.setItem(STORAGE_TYPE_KEY, type);

      // Fetch data in parallel
      await Promise.all([
        fetchDelegation(walletAddress),
        fetchRaceProfile(walletAddress),
        recordSiteVisit(walletAddress),
      ]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [fetchDelegation, fetchRaceProfile, recordSiteVisit]);

  // Disconnect
  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletType(null);
    setDelegation(null);
    setRaceProfile(null);
    localStorage.removeItem(STORAGE_ADDRESS_KEY);
    localStorage.removeItem(STORAGE_TYPE_KEY);
  }, []);

  // Refresh functions
  const refreshDelegation = useCallback(async () => {
    if (address) await fetchDelegation(address);
  }, [address, fetchDelegation]);

  const refreshRaceProfile = useCallback(async () => {
    if (address) await fetchRaceProfile(address);
  }, [address, fetchRaceProfile]);

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
