'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useWallet } from '@/components/wallet/wallet-provider';
import { WalletModal } from '@/components/wallet/wallet-modal';
import { Menu, X, Baby, Leaf, TreeDeciduous, Trophy } from 'lucide-react';

const navigation = [
  { name: 'Community', href: '/community' },
  { name: 'Sloth Race', href: '/sloth-race' },
  { name: 'Validator', href: '/validator' },
  { name: 'Holdings', href: '/holdings' },
  { name: 'NFTs', href: '/nfts' },
  { name: 'Docs', href: '/white-paper' },
];

const CLASS_ICONS = {
  BABY: <Baby className="w-4 h-4 text-amber-400" />,
  TEEN: <Leaf className="w-4 h-4 text-emerald-400" />,
  ADULT: <TreeDeciduous className="w-4 h-4 text-canopy-400" />,
};

export function Header() {
  const { address, isConnected, disconnect, raceProfile } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-coreezy-950/95 backdrop-blur-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 sm:h-24 lg:h-28 items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Coreezy"
                width={88}
                height={88}
                className="w-14 h-14 sm:w-[72px] sm:h-[72px] lg:w-[88px] lg:h-[88px] rounded-full hover:scale-105 transition-transform"
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
                <div className="flex items-center gap-3">
                  {/* Race Profile Badge */}
                  {raceProfile && (
                    <Link
                      href={`/sloth-race/${address}`}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-coreezy-800/50 hover:bg-coreezy-800 transition-colors"
                      title="View your Sloth Race profile"
                    >
                      {CLASS_ICONS[raceProfile.class]}
                      <span className="text-xs font-medium text-coreezy-300">
                        #{raceProfile.rank}
                      </span>
                    </Link>
                  )}
                  <span className="hidden lg:inline text-sm text-coreezy-400">
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
            <div className="md:hidden py-4 border-t border-coreezy-700 safe-bottom">
              <div className="flex flex-col gap-1">
                {/* Mobile Race Profile Card */}
                {isConnected && raceProfile && (
                  <Link
                    href={`/sloth-race/${address}`}
                    className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-coreezy-800/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {CLASS_ICONS[raceProfile.class]}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-coreezy-200">
                        Your Sloth Profile
                      </div>
                      <div className="text-xs text-coreezy-400">
                        Rank #{raceProfile.rank} • {raceProfile.class.toLowerCase()}
                      </div>
                    </div>
                    <Trophy className="w-4 h-4 text-canopy-400" />
                  </Link>
                )}
                
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 text-base font-medium text-coreezy-300 hover:text-coreezy-100 active:bg-coreezy-800 hover:bg-coreezy-800/50 rounded-lg transition-colors touch-target"
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
