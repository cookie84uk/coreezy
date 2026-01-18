/**
 * Wallet Adapter System
 * 
 * Modular wallet connection for Coreum
 * Add new wallets by implementing the WalletAdapter interface
 */

// Coreum chain configuration
export const COREUM_CHAIN_CONFIG = {
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

// Wallet types
export type WalletType = 'keplr' | 'leap' | 'cosmostation' | 'xdefi';

// Wallet adapter interface
export interface WalletAdapter {
  id: WalletType;
  name: string;
  icon: string; // Path or URL to icon
  downloadUrl: string;
  isInstalled: () => boolean;
  connect: () => Promise<string>; // Returns address
  disconnect: () => void;
  getOfflineSigner: () => any;
}

// Check if a wallet is available in the browser
function getWalletFromWindow(type: WalletType): any {
  if (typeof window === 'undefined') return null;
  
  switch (type) {
    case 'keplr':
      return (window as any).keplr;
    case 'leap':
      return (window as any).leap;
    case 'cosmostation':
      return (window as any).cosmostation?.providers?.keplr;
    case 'xdefi':
      return (window as any).xfi?.keplr;
    default:
      return null;
  }
}

// Create a Keplr-compatible adapter (works for Keplr, Leap, Cosmostation, XDEFI)
function createKeplrCompatibleAdapter(
  id: WalletType,
  name: string,
  icon: string,
  downloadUrl: string
): WalletAdapter {
  return {
    id,
    name,
    icon,
    downloadUrl,
    
    isInstalled: () => !!getWalletFromWindow(id),
    
    connect: async () => {
      const wallet = getWalletFromWindow(id);
      if (!wallet) {
        throw new Error(`${name} wallet not installed. Please install it from ${downloadUrl}`);
      }
      
      // Suggest chain (in case not already added)
      try {
        await wallet.experimentalSuggestChain(COREUM_CHAIN_CONFIG);
      } catch (e) {
        // Chain might already be added
        console.log('Chain suggestion:', e);
      }
      
      // Enable the chain
      await wallet.enable(COREUM_CHAIN_CONFIG.chainId);
      
      // Get accounts
      const offlineSigner = wallet.getOfflineSigner(COREUM_CHAIN_CONFIG.chainId);
      const accounts = await offlineSigner.getAccounts();
      
      if (!accounts.length) {
        throw new Error('No accounts found in wallet');
      }
      
      return accounts[0].address;
    },
    
    disconnect: () => {
      // Most Keplr-compatible wallets don't have a disconnect method
      // We just clear local state
    },
    
    getOfflineSigner: () => {
      const wallet = getWalletFromWindow(id);
      if (!wallet) return null;
      return wallet.getOfflineSigner(COREUM_CHAIN_CONFIG.chainId);
    },
  };
}

// Available wallet adapters
export const WALLET_ADAPTERS: Record<WalletType, WalletAdapter> = {
  keplr: createKeplrCompatibleAdapter(
    'keplr',
    'Keplr',
    '/wallets/keplr.svg',
    'https://www.keplr.app/download'
  ),
  leap: createKeplrCompatibleAdapter(
    'leap',
    'Leap',
    '/wallets/leap.svg',
    'https://www.leapwallet.io/download'
  ),
  cosmostation: createKeplrCompatibleAdapter(
    'cosmostation',
    'Cosmostation',
    '/wallets/cosmostation.svg',
    'https://cosmostation.io/wallet'
  ),
  xdefi: createKeplrCompatibleAdapter(
    'xdefi',
    'XDEFI',
    '/wallets/xdefi.svg',
    'https://www.xdefi.io/'
  ),
};

// Get all available (installed) wallets
export function getAvailableWallets(): WalletAdapter[] {
  return Object.values(WALLET_ADAPTERS).filter(adapter => adapter.isInstalled());
}

// Get all wallets (installed or not)
export function getAllWallets(): WalletAdapter[] {
  return Object.values(WALLET_ADAPTERS);
}

// Get a specific adapter
export function getWalletAdapter(type: WalletType): WalletAdapter | null {
  return WALLET_ADAPTERS[type] || null;
}
