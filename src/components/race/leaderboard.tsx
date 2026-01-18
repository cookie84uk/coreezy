'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Baby, Leaf, TreeDeciduous, Moon, Rocket, Flame, Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

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
    icon: <Baby className="w-4 h-4" />,
    label: 'Baby',
    color: 'text-amber-400',
  },
  TEEN: {
    badge: 'badge-teen',
    icon: <Leaf className="w-4 h-4" />,
    label: 'Teen',
    color: 'text-emerald-400',
  },
  ADULT: {
    badge: 'badge-adult',
    icon: <TreeDeciduous className="w-4 h-4" />,
    label: 'Adult',
    color: 'text-canopy-400',
  },
};

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<LeaderboardEntry | null>(null);
  const [searching, setSearching] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Search for wallet
  const searchWallet = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResult(null);
      return;
    }
    
    setSearching(true);
    try {
      const response = await fetch(`/api/race/leaderboard?search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.leaderboard && result.leaderboard.length > 0) {
          setSearchResult(result.leaderboard[0]);
        } else {
          setSearchResult(null);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      searchWallet(debouncedSearch);
    } else {
      setSearchResult(null);
    }
  }, [debouncedSearch, searchWallet]);

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
              className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                classFilter === c
                  ? 'bg-canopy-600 text-white'
                  : `bg-coreezy-700 ${CLASS_STYLES[c].color} hover:bg-coreezy-600`
              }`}
            >
              {CLASS_STYLES[c].icon}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar with Search */}
      <div className="px-4 py-2 bg-coreezy-800/50 border-b border-coreezy-700 flex flex-wrap items-center justify-between gap-3">
        {/* Stats */}
        {data?.classDistribution && data.classDistribution.total > 0 && (
          <div className="flex flex-wrap gap-3 text-xs text-coreezy-400">
            <span>Total: {data.classDistribution.total}</span>
            <span className="flex items-center gap-1 text-canopy-400">
              <TreeDeciduous className="w-3 h-3" /> {data.classDistribution.adult}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Leaf className="w-3 h-3" /> {data.classDistribution.teen}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Baby className="w-3 h-3" /> {data.classDistribution.baby}
            </span>
          </div>
        )}
        
        {/* Search */}
        <div className="relative flex-1 max-w-xs min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-coreezy-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wallet..."
            className="w-full bg-coreezy-900/50 border border-coreezy-700 rounded pl-8 pr-8 py-1.5 text-sm text-coreezy-200 placeholder:text-coreezy-600 focus:outline-none focus:border-canopy-600"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResult(null);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-coreezy-500 hover:text-coreezy-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Search Result */}
      {searchQuery && (
        <div className="px-4 py-3 bg-canopy-900/20 border-b border-canopy-700/50">
          {searching ? (
            <div className="text-sm text-coreezy-400">Searching...</div>
          ) : searchResult ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-coreezy-500">Found:</span>
                <Link
                  href={`/sloth-race/${searchResult.address}`}
                  className="flex items-center gap-2 hover:text-canopy-400 transition-colors"
                >
                  <span className={`${CLASS_STYLES[searchResult.class].color}`}>
                    {CLASS_STYLES[searchResult.class].icon}
                  </span>
                  <span className="font-mono text-sm text-coreezy-200">
                    {searchResult.name || searchResult.shortAddress}
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-coreezy-400">Rank #{searchResult.rank}</span>
                <span className="font-mono text-canopy-400">{formatScore(searchResult.score)}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-coreezy-500">No wallet found matching "{searchQuery}"</div>
          )}
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
                <th className="px-4 py-3 text-right">Distance</th>
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
                        <span title="Sleeping (undelegated recently)">
                          <Moon className="w-4 h-4 text-purple-400" />
                        </span>
                      )}
                      {entry.hasBoosts && (
                        <span title={`${entry.boostCount} active boost(s)`}>
                          <Rocket className="w-4 h-4 text-cyan-400" />
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 ${CLASS_STYLES[entry.class].color}`}>
                      {CLASS_STYLES[entry.class].icon} {CLASS_STYLES[entry.class].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-coreezy-200">
                    {formatScore(entry.score)}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    {entry.restakeStreak > 0 && (
                      <span className="flex items-center justify-end gap-1 text-amber-400" title="Restake streak">
                        <Flame className="w-4 h-4" /> {entry.restakeStreak}
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

// Score is stored as meters * 1000 for precision
// Format as distance traveled (sloth race metaphor)
function formatScore(score: string): string {
  // Score is meters * 1000
  const scoreBigInt = BigInt(score);
  const meters = Number(scoreBigInt) / 1000;
  
  if (meters >= 1000) {
    const km = meters / 1000;
    if (km >= 100) {
      return km.toFixed(0) + ' km';
    }
    return km.toFixed(2) + ' km';
  }
  
  return meters.toFixed(1) + ' m';
}
