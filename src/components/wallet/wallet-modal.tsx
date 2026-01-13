'use client';

import { useEffect, useState } from 'react';
import { useWallet } from './wallet-provider';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const wallets = [
  {
    id: 'leap' as const,
    name: 'Leap Wallet',
    icon: '🌊',
    description: 'Recommended for Coreum',
    installUrl: 'https://www.leapwallet.io/',
  },
  {
    id: 'keplr' as const,
    name: 'Keplr',
    icon: '🔮',
    description: 'Popular Cosmos wallet',
    installUrl: 'https://www.keplr.app/',
  },
];

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<{
    leap: boolean;
    keplr: boolean;
  }>({ leap: false, keplr: false });

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setAvailableWallets({
        leap: !!window.leap,
        keplr: !!window.keplr,
      });
    }
  }, [isOpen]);

  const handleConnect = async (walletId: 'keplr' | 'leap') => {
    setError(null);
    try {
      await connect(walletId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 card p-6">
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
          {wallets.map((wallet) => {
            const isAvailable = availableWallets[wallet.id];
            return (
              <button
                key={wallet.id}
                onClick={() =>
                  isAvailable
                    ? handleConnect(wallet.id)
                    : window.open(wallet.installUrl, '_blank')
                }
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-coreezy-800/50 border border-coreezy-700 hover:border-canopy-500 hover:bg-coreezy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-3xl">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-coreezy-100">
                    {wallet.name}
                  </div>
                  <div className="text-xs text-coreezy-400">
                    {isAvailable ? wallet.description : 'Click to install'}
                  </div>
                </div>
                {!isAvailable && (
                  <span className="text-xs text-coreezy-500 px-2 py-1 rounded bg-coreezy-700">
                    Not installed
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
