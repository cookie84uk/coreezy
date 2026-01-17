'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LeaderboardEntry {
  rank: number;
  address: string;
  shortAddress: string;
  name: string | null;
  class: 'BABY' | 'TEEN' | 'ADULT';
  score: string;
  restakeStreak: number;
  daysAwake: number;
  isSleeping: boolean;
  hasBoosts: boolean;
  boostCount: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  classDistribution: {
    baby: number;
    teen: number;
    adult: number;
    total: number;
  };
}

const CLASS_STYLES = {
  BABY: {
    badge: 'badge-baby',
    icon: '🍼',
    label: 'Baby',
  },
  TEEN: {
    badge: 'badge-teen',
    icon: '🌿',
    label: 'Teen',
  },
  ADULT: {
    badge: 'badge-adult',
    icon: '🌳',
    label: 'Adult',
  },
};

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [classFilter, setClassFilter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', '25');
        if (classFilter) params.set('class', classFilter);

        const response = await fetch(`/api/race/leaderboard?${params}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [page, classFilter]);

  const hasData = data && data.leaderboard.length > 0;

  return (
    <div className="card">
      {/* Header */}
      <div className="p-4 border-b border-coreezy-700 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-coreezy-100">Leaderboard</h2>

        {/* Class Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setClassFilter(null)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              !classFilter
                ? 'bg-canopy-600 text-white'
                : 'bg-coreezy-700 text-coreezy-300 hover:bg-coreezy-600'
            }`}
          >
            All
          </button>
          {(['ADULT', 'TEEN', 'BABY'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setClassFilter(c)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                classFilter === c
                  ? 'bg-canopy-600 text-white'
                  : 'bg-coreezy-700 text-coreezy-300 hover:bg-coreezy-600'
              }`}
            >
              {CLASS_STYLES[c].icon}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      {data?.classDistribution && data.classDistribution.total > 0 && (
        <div className="px-4 py-2 bg-coreezy-800/50 border-b border-coreezy-700 flex flex-wrap gap-4 text-xs text-coreezy-400">
          <span>Total: {data.classDistribution.total}</span>
          <span>🌳 {data.classDistribution.adult}</span>
          <span>🌿 {data.classDistribution.teen}</span>
          <span>🍼 {data.classDistribution.baby}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse text-coreezy-400">Loading...</div>
          </div>
        ) : !hasData ? (
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <Image src="/logo.png" alt="Coreezy" width={64} height={64} className="rounded-full opacity-50" />
            </div>
            <p className="text-coreezy-400">No participants yet.</p>
            <p className="text-sm text-coreezy-500 mt-2">
              Connect your wallet and delegate to join the race!
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-coreezy-400 border-b border-coreezy-700">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Sloth</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Streak</th>
              </tr>
            </thead>
            <tbody>
              {data.leaderboard.map((entry) => (
                <tr
                  key={entry.address}
                  className={`border-b border-coreezy-800 hover:bg-coreezy-800/30 transition-colors ${
                    entry.isSleeping ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono ${
                        entry.rank <= 3 ? 'text-canopy-400 font-bold' : 'text-coreezy-400'
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/sloth-race/${entry.address}`}
                      className="flex items-center gap-2 hover:text-canopy-400 transition-colors"
                    >
                      <span className="font-mono text-sm text-coreezy-300">
                        {entry.name || entry.shortAddress}
                      </span>
                      {entry.isSleeping && (
                        <span title="Sleeping (undelegated recently)">😴</span>
                      )}
                      {entry.hasBoosts && (
                        <span title={`${entry.boostCount} active boost(s)`}>🚀</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={CLASS_STYLES[entry.class].badge}>
                      {CLASS_STYLES[entry.class].icon} {CLASS_STYLES[entry.class].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-coreezy-200">
                    {formatScore(entry.score)}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    {entry.restakeStreak > 0 && (
                      <span className="text-amber-400" title="Restake streak">
                        🔥 {entry.restakeStreak}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="p-4 border-t border-coreezy-700 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost px-3 py-1 text-sm disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm text-coreezy-400">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
            disabled={page === data.pagination.pages}
            className="btn-ghost px-3 py-1 text-sm disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function formatScore(score: string): string {
  const num = BigInt(score);
  if (num >= BigInt(1_000_000_000_000)) {
    return (Number(num / BigInt(1_000_000_000)) / 1000).toFixed(2) + 'T';
  }
  if (num >= BigInt(1_000_000_000)) {
    return (Number(num / BigInt(1_000_000)) / 1000).toFixed(2) + 'B';
  }
  if (num >= BigInt(1_000_000)) {
    return (Number(num / BigInt(1_000)) / 1000).toFixed(2) + 'M';
  }
  if (num >= BigInt(1_000)) {
    return (Number(num) / 1000).toFixed(2) + 'K';
  }
  return score;
}
