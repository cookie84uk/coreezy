'use client';

import { useEffect, useState } from 'react';
import { Baby, Leaf, TreeDeciduous, Trophy, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';

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
    accumulated: number;
    pendingContribution: number;
    distribution: { adult: number; teen: number; baby: number };
    commissionPercent: number;
  };
  validator: {
    pendingCommission: number;
    commissionRate: string;
    prizePoolContribution: string;
  } | null;
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
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="card animate-pulse">
        <div className="p-4 flex items-center justify-between">
          <div className="h-6 bg-coreezy-700 rounded w-48" />
          <div className="h-6 bg-coreezy-700 rounded w-24" />
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
      {/* Accordion Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-coreezy-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-coreezy-100">{data.season.name} Prize Pool</span>
          <span className="text-xl font-bold text-canopy-400 ml-2">
            {formatCore(data.pool.total)} CORE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-xs text-coreezy-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.daysRemaining} days
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {data.totalParticipants}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-coreezy-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-coreezy-400" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <>
          {/* Total Pool Info */}
          <div className="px-4 pb-4 border-b border-coreezy-800">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
              <div className="text-coreezy-400">
                {data.pool.accumulated > 0 && (
                  <>
                    <span className="text-canopy-400">{formatCore(data.pool.accumulated)}</span> from past claims
                  </>
                )}
                {data.pool.pendingContribution > 0 && (
                  <>
                    {data.pool.accumulated > 0 ? ' + ' : ''}
                    <span className="text-emerald-400">{formatCore(data.pool.pendingContribution)}</span> pending
                  </>
                )}
                {data.pool.accumulated === 0 && data.pool.pendingContribution === 0 && (
                  <span className="text-coreezy-500">Pool will grow from validator commission</span>
                )}
              </div>
              {data.validator && (
                <div className="text-coreezy-500 sm:ml-auto">
                  {data.pool.commissionPercent}% of {formatCore(data.validator.pendingCommission)} CORE commission
                </div>
              )}
            </div>
          </div>

          {/* Class Distribution */}
          <div className="grid grid-cols-3 divide-x divide-coreezy-800">
            {/* Adult */}
            <div className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-canopy-900/30">
                  <TreeDeciduous className="w-5 h-5 text-canopy-400" />
                </div>
              </div>
              <div className="text-lg font-bold text-canopy-400">
                {formatCore(data.classes.adult.pool)}
              </div>
              <div className="text-xs text-coreezy-500">
                {data.classes.adult.percent}% • {data.classes.adult.participants} racers
              </div>
              <div className="text-xs text-coreezy-400 mt-1">
                ~{formatCore(data.classes.adult.perParticipant)} each
              </div>
            </div>

            {/* Teen */}
            <div className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-emerald-900/30">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {formatCore(data.classes.teen.pool)}
              </div>
              <div className="text-xs text-coreezy-500">
                {data.classes.teen.percent}% • {data.classes.teen.participants} racers
              </div>
              <div className="text-xs text-coreezy-400 mt-1">
                ~{formatCore(data.classes.teen.perParticipant)} each
              </div>
            </div>

            {/* Baby */}
            <div className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-amber-900/30">
                  <Baby className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="text-lg font-bold text-amber-400">
                {formatCore(data.classes.baby.pool)}
              </div>
              <div className="text-xs text-coreezy-500">
                {data.classes.baby.percent}% • {data.classes.baby.participants} racers
              </div>
              <div className="text-xs text-coreezy-400 mt-1">
                ~{formatCore(data.classes.baby.perParticipant)} each
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-coreezy-800/30 text-center">
            <p className="text-xs text-coreezy-500">
              Pool distributed at season end based on final rankings within each class
            </p>
          </div>
        </>
      )}
    </div>
  );
}
