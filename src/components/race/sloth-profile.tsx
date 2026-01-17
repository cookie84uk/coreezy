'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileData {
  address: string;
  name: string | null;
  class: 'BABY' | 'TEEN' | 'ADULT';
  rank: number;
  percentile: string;
  score: string;
  delegationScore: string;
  restakeStreak: number;
  daysAwake: number;
  isSleeping: boolean;
  sleepUntil: string | null;
  lastSiteVisit: string | null;
  joinedAt: string;
  activeBoosts: Array<{
    platform: string;
    multiplier: number;
    expiresAt: string;
  }>;
}

interface HistoryEntry {
  date: string;
  delegationAmount: string;
  dailyScore: string;
  restakeActive: boolean;
  siteVisited: boolean;
}

interface SlothProfileProps {
  address: string;
}

const CLASS_CONFIG = {
  BABY: {
    icon: '🍼',
    name: 'Baby Sloth',
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/30',
    borderColor: 'border-amber-700/50',
  },
  TEEN: {
    icon: '🌿',
    name: 'Teen Sloth',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/30',
    borderColor: 'border-emerald-700/50',
  },
  ADULT: {
    icon: '🌳',
    name: 'Adult Sloth',
    color: 'text-canopy-400',
    bgColor: 'bg-canopy-900/30',
    borderColor: 'border-canopy-700/50',
  },
};

export function SlothProfile({ address }: SlothProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/race/profile/${address}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Profile not found. Connect your wallet and delegate to join the race!');
          } else {
            setError('Failed to load profile');
          }
          return;
        }
        const data = await response.json();
        setProfile(data.profile);
        setHistory(data.history || []);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [address]);

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse">
          <div className="h-20 w-20 bg-coreezy-700 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-coreezy-700 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-coreezy-700 rounded w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="card p-8 text-center">
        <div className="mb-4 flex justify-center">
          <Image src="/logo.png" alt="Coreezy" width={64} height={64} className="rounded-full opacity-50" />
        </div>
        <p className="text-coreezy-300 mb-4">{error}</p>
        <Link href="/sloth-race" className="btn-primary px-4 py-2">
          ← Back to Leaderboard
        </Link>
      </div>
    );
  }

  const classConfig = CLASS_CONFIG[profile.class];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/sloth-race"
        className="inline-flex items-center text-coreezy-400 hover:text-coreezy-200 transition-colors"
      >
        ← Back to Leaderboard
      </Link>

      {/* Profile Header */}
      <div className={`card p-6 ${classConfig.bgColor} border ${classConfig.borderColor}`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full ${classConfig.bgColor} border-4 ${classConfig.borderColor} flex items-center justify-center text-4xl ${
                profile.isSleeping ? 'sloth-sleeping' : ''
              }`}
            >
              {profile.isSleeping ? '😴' : classConfig.icon}
            </div>
            {profile.activeBoosts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                🚀
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-coreezy-100">
              {profile.name || `Sloth #${profile.rank}`}
            </h1>
            <p className="font-mono text-sm text-coreezy-400 mt-1">{address}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className={`badge ${classConfig.bgColor} ${classConfig.color} border ${classConfig.borderColor}`}>
                {classConfig.icon} {classConfig.name}
              </span>
              <span className="badge bg-coreezy-800 text-coreezy-200">
                Rank #{profile.rank}
              </span>
              <span className="badge bg-coreezy-800 text-coreezy-200">
                Top {profile.percentile}%
              </span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              const text = `Check out my Sloth Race profile on @CoreezyVibes!\n\n${classConfig.icon} ${classConfig.name}\n🏆 Rank #${profile.rank}\n\nhttps://coreezy.xyz/sloth-race/${address}`;
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                '_blank'
              );
            }}
            className="btn-outline px-4 py-2 text-sm"
          >
            Share on X
          </button>
        </div>

        {/* Sleep Warning */}
        {profile.isSleeping && profile.sleepUntil && (
          <div className="mt-4 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50 text-center">
            <p className="text-amber-300 text-sm">
              😴 This sloth is sleeping until{' '}
              {new Date(profile.sleepUntil).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-canopy-400">
            {formatScore(profile.score)}
          </div>
          <div className="text-xs text-coreezy-400">Total Score</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-canopy-400">
            {profile.restakeStreak > 0 ? `🔥 ${profile.restakeStreak}` : '—'}
          </div>
          <div className="text-xs text-coreezy-400">Restake Streak</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-canopy-400">{profile.daysAwake}</div>
          <div className="text-xs text-coreezy-400">Days Active</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-canopy-400">
            {profile.activeBoosts.length}
          </div>
          <div className="text-xs text-coreezy-400">Active Boosts</div>
        </div>
      </div>

      {/* Active Boosts */}
      {profile.activeBoosts.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-coreezy-400 mb-3">
            🚀 Active Boosts
          </h3>
          <div className="space-y-2">
            {profile.activeBoosts.map((boost, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-coreezy-800/50"
              >
                <span className="text-coreezy-200">{boost.platform}</span>
                <div className="text-right">
                  <span className="text-canopy-400">+{boost.multiplier}%</span>
                  <span className="text-xs text-coreezy-500 ml-2">
                    expires {new Date(boost.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-coreezy-400 mb-3">
            Recent Activity (Last 30 Days)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-coreezy-500 border-b border-coreezy-700">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Delegation</th>
                  <th className="pb-2 text-right">Score</th>
                  <th className="pb-2 text-center">Restake</th>
                  <th className="pb-2 text-center">Visit</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((entry, i) => (
                  <tr key={i} className="border-b border-coreezy-800">
                    <td className="py-2 text-coreezy-300">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-right font-mono text-coreezy-400">
                      {formatCore(entry.delegationAmount)}
                    </td>
                    <td className="py-2 text-right font-mono text-canopy-400">
                      {formatScore(entry.dailyScore)}
                    </td>
                    <td className="py-2 text-center">
                      {entry.restakeActive ? '✓' : '—'}
                    </td>
                    <td className="py-2 text-center">
                      {entry.siteVisited ? '✓' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Since */}
      <div className="text-center text-xs text-coreezy-500">
        Member since {new Date(profile.joinedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function formatScore(score: string): string {
  const num = BigInt(score);
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

function formatCore(amount: string): string {
  const num = Number(amount) / 1_000_000;
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(2);
}
