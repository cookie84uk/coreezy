'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

type WalletType = 'keplr' | 'leap';

export interface DelegationInfo {
  address: string;
  shares: string;
  balance: {
    denom: string;
    amount: string;
  };
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletType: WalletType | null;
  delegation: DelegationInfo | null;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshDelegation: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Extend window for wallet types
declare global {
  interface Window {
    keplr?: any;
    leap?: any;
  }
}

// Coreum chain config for wallets
const COREUM_CHAIN_CONFIG = {
  chainId: 'coreum-mainnet-1',
  chainName: 'Coreum',
  rpc: 'https://full-node.mainnet-1.coreum.dev:26657',
  rest: 'https://full-node.mainnet-1.coreum.dev:1317',
  bip44: { coinType: 990 },
  bech32Config: {
    bech32PrefixAccAddr: 'core',
    bech32PrefixAccPub: 'corepub',
    bech32PrefixValAddr: 'corevaloper',
    bech32PrefixValPub: 'corevaloperpub',
    bech32PrefixConsAddr: 'corevalcons',
    bech32PrefixConsPub: 'corevalconspub',
  },
  currencies: [{ coinDenom: 'CORE', coinMinimalDenom: 'ucore', coinDecimals: 6 }],
  feeCurrencies: [
    {
      coinDenom: 'CORE',
      coinMinimalDenom: 'ucore',
      coinDecimals: 6,
      gasPriceStep: { low: 0.0625, average: 0.1, high: 0.15 },
    },
  ],
  stakeCurrency: { coinDenom: 'CORE', coinMinimalDenom: 'ucore', coinDecimals: 6 },
  features: ['cosmwasm', 'ibc-transfer', 'ibc-go'],
};

async function suggestChain(wallet: any) {
  await wallet.experimentalSuggestChain(COREUM_CHAIN_CONFIG);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [delegation, setDelegation] = useState<DelegationInfo | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('coreezy_wallet_address');
    const savedType = localStorage.getItem('coreezy_wallet_type') as WalletType;

    if (savedAddress && savedType) {
      reconnect(savedType, savedAddress);
    }
  }, []);

  const reconnect = async (type: WalletType, savedAddress: string) => {
    try {
      const wallet = type === 'keplr' ? window.keplr : window.leap;
      if (!wallet) return;

      await suggestChain(wallet);
      await wallet.enable(COREUM_CHAIN_CONFIG.chainId);

      const offlineSigner = wallet.getOfflineSigner(COREUM_CHAIN_CONFIG.chainId);
      const accounts = await offlineSigner.getAccounts();

      if (accounts[0]?.address === savedAddress) {
        setAddress(savedAddress);
        setWalletType(type);
        await fetchDelegation(savedAddress);
      } else {
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
      // Fetch delegation via API route (server-side)
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

  const connect = useCallback(async (type: WalletType) => {
    setIsConnecting(true);

    try {
      const wallet = type === 'keplr' ? window.keplr : window.leap;

      if (!wallet) {
        const walletName = type === 'keplr' ? 'Keplr' : 'Leap';
        throw new Error(
          `${walletName} wallet not installed. Please install it from the browser extension store.`
        );
      }

      await suggestChain(wallet);
      await wallet.enable(COREUM_CHAIN_CONFIG.chainId);

      const offlineSigner = wallet.getOfflineSigner(COREUM_CHAIN_CONFIG.chainId);
      const accounts = await offlineSigner.getAccounts();

      if (!accounts.length) {
        throw new Error('No accounts found in wallet');
      }

      const walletAddress = accounts[0].address;
      setAddress(walletAddress);
      setWalletType(type);

      localStorage.setItem('coreezy_wallet_address', walletAddress);
      localStorage.setItem('coreezy_wallet_type', type);

      // Record site visit
      try {
        await fetch('/api/race/site-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: walletAddress }),
        });
      } catch (error) {
        console.error('Failed to record site visit:', error);
      }

      await fetchDelegation(walletAddress);
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
    localStorage.removeItem('coreezy_wallet_address');
    localStorage.removeItem('coreezy_wallet_type');
  }, []);

  const refreshDelegation = useCallback(async () => {
    if (!address) return;
    await fetchDelegation(address);
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        walletType,
        delegation,
        connect,
        disconnect,
        refreshDelegation,
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
