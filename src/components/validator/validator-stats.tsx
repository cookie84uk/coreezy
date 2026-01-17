'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Coins, Percent, Users, Activity, ExternalLink } from 'lucide-react';

interface ValidatorData {
  operatorAddress: string;
  moniker: string;
  totalStakedCore: string;
  commission: {
    rate: string;
  };
  totalDelegators: number;
  status: string;
  jailed: boolean;
}

export function ValidatorStats() {
  const [validator, setValidator] = useState<ValidatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/validator');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setValidator(data.validator);
      } catch (err) {
        setError('Failed to load validator stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-coreezy-700 rounded w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-10 bg-coreezy-700 rounded mb-2" />
                <div className="h-4 bg-coreezy-700 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !validator) {
    return (
      <div className="card p-8 text-center">
        <p className="text-coreezy-400">{error || 'Unable to load validator data'}</p>
      </div>
    );
  }

  const isActive = validator.status === 'BOND_STATUS_BONDED' && !validator.jailed;

  return (
    <div className="card p-8">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Image src="/logo.png" alt="Coreezy" width={40} height={40} className="rounded-full" />
        <h2 className="text-2xl font-bold text-coreezy-100">{validator.moniker}</h2>
        <span
          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
            isActive
              ? 'bg-canopy-900/50 text-canopy-300 border border-canopy-700'
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`}
        >
          <Activity className="w-3 h-3" />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-canopy-400" />
          </div>
          <div className="text-3xl font-bold text-canopy-400">
            {formatNumber(parseFloat(validator.totalStakedCore))}
          </div>
          <div className="text-sm text-coreezy-400">CORE Staked</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-canopy-400" />
          </div>
          <div className="text-3xl font-bold text-canopy-400">
            {validator.commission.rate}%
          </div>
          <div className="text-sm text-coreezy-400">Commission</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-canopy-400" />
          </div>
          <div className="text-3xl font-bold text-canopy-400">
            {validator.totalDelegators.toLocaleString()}
          </div>
          <div className="text-sm text-coreezy-400">Delegators</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-canopy-400" />
          </div>
          <div className="text-3xl font-bold text-canopy-400">99.9%</div>
          <div className="text-sm text-coreezy-400">Uptime</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-coreezy-700 flex flex-wrap justify-center gap-4 text-sm">
        <a
          href={`https://www.mintscan.io/coreum/validators/${validator.operatorAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-canopy-400 hover:text-canopy-300 transition-colors flex items-center gap-1"
        >
          View on Mintscan <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href={`https://explorer.coreum.com/coreum/validators/${validator.operatorAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-canopy-400 hover:text-canopy-300 transition-colors flex items-center gap-1"
        >
          View on Coreum Explorer <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toFixed(2);
}
