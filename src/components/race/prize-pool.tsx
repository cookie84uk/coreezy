'use client';

import { useEffect, useState } from 'react';
import { Baby, Leaf, TreeDeciduous, Trophy, Clock, Users } from 'lucide-react';

interface PrizePoolData {
  season: {
    name: string;
    startDate: string;
    endDate: string;
  };
  isActive: boolean;
  daysRemaining: number;
  pool: {
    total: number;
    distribution: { adult: number; teen: number; baby: number };
    commissionPercent: number;
  };
  classes: {
    adult: { pool: number; percent: number; participants: number; perParticipant: number };
    teen: { pool: number; percent: number; participants: number; perParticipant: number };
    baby: { pool: number; percent: number; participants: number; perParticipant: number };
  };
  totalParticipants: number;
}

export function PrizePool() {
  const [data, setData] = useState<PrizePoolData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrizePool() {
      try {
        const response = await fetch('/api/race/prize-pool');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch prize pool:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrizePool();
  }, []);

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-coreezy-700 rounded w-32 mb-4" />
        <div className="h-16 bg-coreezy-700 rounded mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-coreezy-700 rounded" />
          <div className="h-24 bg-coreezy-700 rounded" />
          <div className="h-24 bg-coreezy-700 rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatCore = (amount: number) => {
    if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toFixed(2);
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-canopy-900/50 to-coreezy-900/50 border-b border-coreezy-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-coreezy-100">{data.season.name} Prize Pool</h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-coreezy-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.daysRemaining} days left
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {data.totalParticipants} racers
            </span>
          </div>
        </div>
      </div>

      {/* Total Pool */}
      <div className="p-6 text-center border-b border-coreezy-800">
        <div className="text-xs text-coreezy-500 mb-1">
          {data.pool.commissionPercent}% of Validator Commission
        </div>
        <div className="text-4xl font-bold text-canopy-400">
          {formatCore(data.pool.total)} <span className="text-xl text-coreezy-400">CORE</span>
        </div>
        <div className="text-xs text-coreezy-500 mt-1">
          Growing throughout the quarter
        </div>
      </div>

      {/* Class Distribution */}
      <div className="grid grid-cols-3 divide-x divide-coreezy-800">
        {/* Adult */}
        <div className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-canopy-900/30">
              <TreeDeciduous className="w-6 h-6 text-canopy-400" />
            </div>
          </div>
          <div className="text-lg font-bold text-canopy-400">
            {formatCore(data.classes.adult.pool)}
          </div>
          <div className="text-xs text-coreezy-500">
            {data.classes.adult.percent}% of pool
          </div>
          <div className="mt-2 pt-2 border-t border-coreezy-800">
            <div className="text-xs text-coreezy-400">
              {data.classes.adult.participants} Adults
            </div>
            <div className="text-sm font-medium text-coreezy-300">
              ~{formatCore(data.classes.adult.perParticipant)} each
            </div>
          </div>
        </div>

        {/* Teen */}
        <div className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-emerald-900/30">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {formatCore(data.classes.teen.pool)}
          </div>
          <div className="text-xs text-coreezy-500">
            {data.classes.teen.percent}% of pool
          </div>
          <div className="mt-2 pt-2 border-t border-coreezy-800">
            <div className="text-xs text-coreezy-400">
              {data.classes.teen.participants} Teens
            </div>
            <div className="text-sm font-medium text-coreezy-300">
              ~{formatCore(data.classes.teen.perParticipant)} each
            </div>
          </div>
        </div>

        {/* Baby */}
        <div className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-amber-900/30">
              <Baby className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="text-lg font-bold text-amber-400">
            {formatCore(data.classes.baby.pool)}
          </div>
          <div className="text-xs text-coreezy-500">
            {data.classes.baby.percent}% of pool
          </div>
          <div className="mt-2 pt-2 border-t border-coreezy-800">
            <div className="text-xs text-coreezy-400">
              {data.classes.baby.participants} Babies
            </div>
            <div className="text-sm font-medium text-coreezy-300">
              ~{formatCore(data.classes.baby.perParticipant)} each
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-coreezy-800/30 text-center">
        <p className="text-xs text-coreezy-500">
          Pool distributed at season end based on final rankings within each class
        </p>
      </div>
    </div>
  );
}
