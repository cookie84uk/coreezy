'use client';

import { useEffect, useState } from 'react';
import { Coins, PieChart, TrendingUp, Clock, Wrench } from 'lucide-react';

// Placeholder data until smart contracts are deployed
// Note: Total COREZ supply is 10,000,000 (10M)
// The vault holds 10% (1M COREZ) reserved for staking
// Target is 1.5M COREUM to achieve 1 COREZ = 1.5 COREUM backing
const VAULT_DATA: {
  totalCoreum: number;
  targetCoreum: number;
  totalCorez: number;
  vaultCorez: number;
  backingRatio: number;
  phase: 'INITIAL' | 'FINAL';
  lastDistribution: string | null;
} = {
  totalCoreum: 150_000, // Current vault COREUM holdings (placeholder)
  targetCoreum: 1_500_000, // Target: 1.5M COREUM for 1:1.5 backing
  totalCorez: 10_000_000, // Total COREZ supply
  vaultCorez: 1_000_000, // 10% of supply in vault staking
  backingRatio: 0.15, // Current backing ratio (placeholder)
  phase: 'INITIAL',
  lastDistribution: null,
};

export function VaultDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="card p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-coreezy-700 rounded w-64 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-12 bg-coreezy-700 rounded mb-2" />
                <div className="h-4 bg-coreezy-700 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progressPercent =
    (VAULT_DATA.totalCoreum / VAULT_DATA.targetCoreum) * 100;

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="card p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="flex justify-center mb-2">
              <Coins className="w-6 h-6 text-canopy-400" />
            </div>
            <div className="text-3xl font-bold text-canopy-400">
              {formatNumber(VAULT_DATA.totalCoreum)}
            </div>
            <div className="text-sm text-coreezy-400">COREUM in Vault</div>
          </div>
          <div>
            <div className="flex justify-center mb-2">
              <PieChart className="w-6 h-6 text-canopy-400" />
            </div>
            <div className="text-3xl font-bold text-canopy-400">
              {formatNumber(VAULT_DATA.totalCorez)}
            </div>
            <div className="text-sm text-coreezy-400">COREZ Total Supply</div>
          </div>
          <div>
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-canopy-400" />
            </div>
            <div className="text-3xl font-bold text-canopy-400">
              {VAULT_DATA.backingRatio.toFixed(2)}:1
            </div>
            <div className="text-sm text-coreezy-400">Current Backing</div>
          </div>
          <div>
            <div className="flex justify-center mb-2">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {VAULT_DATA.phase === 'INITIAL' ? 'Initial' : 'Final'}
            </div>
            <div className="text-sm text-coreezy-400">Current Phase</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-coreezy-400 mb-2">
            <span>Progress to 1.5:1 Target (1 COREZ = 1.5 COREUM)</span>
            <span>{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-coreezy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-canopy-600 to-canopy-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-coreezy-500 mt-1">
            <span>0</span>
            <span>{formatNumber(VAULT_DATA.targetCoreum)} COREUM</span>
          </div>
        </div>
      </div>

      {/* Value Indicator */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-coreezy-400 mb-4">
          Current Backing per COREZ (Vault Portion)
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-canopy-400">
            {(VAULT_DATA.totalCoreum / VAULT_DATA.vaultCorez).toFixed(6)}
          </span>
          <span className="text-coreezy-400">COREUM / COREZ</span>
        </div>
        <p className="mt-2 text-xs text-coreezy-500">
          Based on vault COREUM holdings ({formatNumber(VAULT_DATA.totalCoreum)}) 
          divided by vault COREZ allocation ({formatNumber(VAULT_DATA.vaultCorez)}).
          Target: 1.5 COREUM / COREZ.
        </p>
      </div>

      {/* Phase Indicator */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-coreezy-400 mb-4">
          Phase Progress
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                VAULT_DATA.phase === 'INITIAL' ? 'bg-amber-400' : 'bg-coreezy-600'
              }`}
            />
            <span
              className={
                VAULT_DATA.phase === 'INITIAL' ? 'text-amber-400' : 'text-coreezy-500'
              }
            >
              Initial Phase
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-coreezy-700" />
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                VAULT_DATA.phase === 'FINAL' ? 'bg-canopy-400' : 'bg-coreezy-600'
              }`}
            />
            <span
              className={
                VAULT_DATA.phase === 'FINAL' ? 'text-canopy-400' : 'text-coreezy-500'
              }
            >
              Final Phase
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-coreezy-400">
          {VAULT_DATA.phase === 'INITIAL'
            ? 'The vault is in the Initial Phase. Rewards: 50% reinvested, 40% to OG NFT holders, 10% to marketing/dev.'
            : 'The vault has reached the Final Phase! 50% buyback/drip, 20% OG NFT, 15% reinvestment, 10% marketing/dev, 5% future NFT holders.'}
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="card p-6 bg-coreezy-800/50 border-dashed border-coreezy-600">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-coreezy-700">
            <Wrench className="w-6 h-6 text-coreezy-400" />
          </div>
          <div>
            <h3 className="font-semibold text-coreezy-200">
              Smart Contract Integration Coming
            </h3>
            <p className="text-sm text-coreezy-400 mt-1">
              Live vault data and automated distributions will be enabled once smart
              contracts are deployed on Coreum mainnet. Currently ledger controlled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + 'K';
  }
  return num.toString();
}
