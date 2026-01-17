'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface StatsData {
  delegators: number;
  vaultCoreum: number;
  loading: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + 'K';
  }
  return num.toString();
}

export function CommunityStats() {
  const [stats, setStats] = useState<StatsData>({
    delegators: 0,
    vaultCoreum: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [validatorRes, holdingsRes] = await Promise.all([
          fetch('/api/validator'),
          fetch('/api/holdings'),
        ]);

        let delegators = 0;
        let vaultCoreum = 0;

        if (validatorRes.ok) {
          const validatorData = await validatorRes.json();
          delegators = validatorData.validator?.totalDelegators || 0;
        }

        if (holdingsRes.ok) {
          const holdingsData = await holdingsRes.json();
          // Use mainVault core balance (liquid + staked)
          const mainVault = holdingsData.wallets?.mainVault;
          if (mainVault) {
            vaultCoreum = (mainVault.core || 0) + (mainVault.coreStaked || 0);
          }
        }

        setStats({
          delegators,
          vaultCoreum,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to fetch community stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="card p-8">
        <h2 className="text-xl font-bold text-canopy-400 mb-6 text-center">
          Community by the Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-9 bg-coreezy-700 rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-coreezy-700 rounded w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h2 className="text-xl font-bold text-canopy-400 mb-6 text-center">
        Community by the Numbers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-canopy-400">
            {stats.delegators}
          </div>
          <div className="text-sm text-coreezy-400">Delegators</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-canopy-400">100</div>
          <div className="text-sm text-coreezy-400">OG NFT Holders</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-canopy-400">
            {formatNumber(stats.vaultCoreum)}
          </div>
          <div className="text-sm text-coreezy-400">COREUM in Vault</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-3xl font-bold text-canopy-400">
            <Clock className="w-6 h-6" />
            24/7
          </div>
          <div className="text-sm text-coreezy-400">Community Support</div>
        </div>
      </div>
    </div>
  );
}
