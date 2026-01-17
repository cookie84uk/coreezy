'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useWallet } from '@/components/wallet/wallet-provider';
import { WalletModal } from '@/components/wallet/wallet-modal';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Community', href: '/community' },
  { name: 'Sloth Race', href: '/sloth-race' },
  { name: 'Validator', href: '/validator' },
  { name: 'Holdings', href: '/holdings' },
  { name: 'NFTs', href: '/nfts' },
  { name: 'Docs', href: '/white-paper' },
];

export function Header() {
  const { address, isConnected, disconnect } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <>
      <header className="sticky top-0 z-50 glass">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Coreezy"
                width={48}
                height={48}
                className="rounded-full"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-coreezy-300 hover:text-coreezy-100 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Wallet Button */}
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm text-coreezy-400">
                    {truncateAddress(address!)}
                  </span>
                  <button
                    onClick={disconnect}
                    className="btn-ghost px-3 py-1.5 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Connect Wallet
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden btn-ghost p-2"
              >
                <span className="sr-only">Open menu</span>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-coreezy-700">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-coreezy-300 hover:text-coreezy-100 hover:bg-coreezy-800/50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
