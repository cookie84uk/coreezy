'use client';

import { useWallet } from '@/components/wallet/wallet-provider';
import Link from 'next/link';

export function RaceInfo() {
  const { isConnected, address } = useWallet();

  return (
    <>
      {/* Your Profile Card */}
      {isConnected && address && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-coreezy-400 mb-3">Your Profile</h3>
          <Link
            href={`/sloth-race/${address}`}
            className="block p-3 rounded-lg bg-coreezy-800/50 hover:bg-coreezy-800 transition-colors"
          >
            <div className="text-sm font-mono text-coreezy-300">
              {address.slice(0, 12)}...{address.slice(-8)}
            </div>
            <div className="text-xs text-canopy-400 mt-1">View your sloth profile →</div>
          </Link>
        </div>
      )}

      {/* How It Works */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-coreezy-400 mb-3">How It Works</h3>
        <div className="space-y-3 text-sm text-coreezy-300">
          <div className="flex gap-3">
            <span className="text-canopy-400">1.</span>
            <span>Delegate COREUM to the Coreezy validator</span>
          </div>
          <div className="flex gap-3">
            <span className="text-canopy-400">2.</span>
            <span>Daily snapshots capture your delegation</span>
          </div>
          <div className="flex gap-3">
            <span className="text-canopy-400">3.</span>
            <span>Earn points based on delegation + bonuses</span>
          </div>
          <div className="flex gap-3">
            <span className="text-canopy-400">4.</span>
            <span>Climb the ranks and earn rewards</span>
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-coreezy-400 mb-3">Scoring</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-coreezy-300">Base Delegation</span>
            <span className="text-coreezy-400">Capped at 50K CORE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-coreezy-300">Restake Bonus</span>
            <span className="text-canopy-400">+10%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-coreezy-300">Site Visit</span>
            <span className="text-canopy-400">+2%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-coreezy-300">Social Boosts</span>
            <span className="text-canopy-400">Up to +15%</span>
          </div>
        </div>
      </div>

      {/* Penalties */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-coreezy-400 mb-3">Sleep Mode</h3>
        <p className="text-sm text-coreezy-300 mb-2">
          Undelegating puts your sloth to sleep for <strong className="text-coreezy-100">3 days</strong>.
        </p>
        <p className="text-xs text-coreezy-400">
          During sleep, you earn 0 points. Stay staked to stay awake!
        </p>
      </div>

      {/* Boost CTA */}
      <div className="card p-4 bg-coreezy-800/50">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">🚀 Get Boosted</h3>
        <p className="text-sm text-coreezy-300 mb-3">
          Share about Coreezy on social media for temporary score boosts.
        </p>
        <Link
          href="/sloth-race/boost"
          className="btn-outline w-full py-2 text-sm justify-center"
        >
          Submit Boost Request
        </Link>
      </div>
    </>
  );
}
