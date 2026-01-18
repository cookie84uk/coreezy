'use client';

import { useEffect, useState } from 'react';
import { useWallet, type WalletType } from './wallet-provider';
import { WALLET_ADAPTERS } from '@/lib/wallet-adapters';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Wallet display config (icons, descriptions)
const WALLET_DISPLAY = {
  leap: {
    name: 'Leap Wallet',
    icon: '🌊',
    description: 'Recommended for Coreum',
    priority: 1,
  },
  keplr: {
    name: 'Keplr',
    icon: '🔮',
    description: 'Popular Cosmos wallet',
    priority: 2,
  },
  cosmostation: {
    name: 'Cosmostation',
    icon: '🌟',
    description: 'Multi-chain wallet',
    priority: 3,
  },
  xdefi: {
    name: 'XDEFI',
    icon: '⚡',
    description: 'Cross-chain wallet',
    priority: 4,
  },
} as const;

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [walletStates, setWalletStates] = useState<Record<WalletType, boolean>>({
    leap: false,
    keplr: false,
    cosmostation: false,
    xdefi: false,
  });

  // Check which wallets are installed
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const states: Record<WalletType, boolean> = {
        leap: false,
        keplr: false,
        cosmostation: false,
        xdefi: false,
      };
      
      for (const [id, adapter] of Object.entries(WALLET_ADAPTERS)) {
        states[id as WalletType] = adapter.isInstalled();
      }
      
      setWalletStates(states);
    }
  }, [isOpen]);

  const handleConnect = async (walletId: WalletType) => {
    setError(null);
    try {
      await connect(walletId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  if (!isOpen) return null;

  // Sort wallets: installed first, then by priority
  const sortedWallets = (Object.keys(WALLET_DISPLAY) as WalletType[])
    .filter(id => WALLET_ADAPTERS[id]) // Only show wallets we have adapters for
    .sort((a, b) => {
      const aInstalled = walletStates[a];
      const bInstalled = walletStates[b];
      if (aInstalled && !bInstalled) return -1;
      if (!aInstalled && bInstalled) return 1;
      return WALLET_DISPLAY[a].priority - WALLET_DISPLAY[b].priority;
    });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md sm:mx-4 card p-6 rounded-b-none sm:rounded-b-xl safe-bottom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-coreezy-100">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-2 -m-2"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {sortedWallets.map((walletId) => {
            const display = WALLET_DISPLAY[walletId];
            const adapter = WALLET_ADAPTERS[walletId];
            const isAvailable = walletStates[walletId];
            
            return (
              <button
                key={walletId}
                onClick={() =>
                  isAvailable
                    ? handleConnect(walletId)
                    : window.open(adapter.downloadUrl, '_blank')
                }
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-coreezy-800/50 border border-coreezy-700 hover:border-canopy-500 hover:bg-coreezy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-3xl">{display.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-coreezy-100">
                    {display.name}
                  </div>
                  <div className="text-xs text-coreezy-400">
                    {isAvailable ? display.description : 'Click to install'}
                  </div>
                </div>
                {isAvailable ? (
                  <span className="text-xs text-canopy-400 px-2 py-1 rounded bg-canopy-900/30">
                    Ready
                  </span>
                ) : (
                  <span className="text-xs text-coreezy-500 px-2 py-1 rounded bg-coreezy-700">
                    Install
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-coreezy-500 text-center">
          By connecting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
