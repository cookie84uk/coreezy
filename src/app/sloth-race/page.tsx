import { Metadata } from 'next';
import { Leaderboard } from '@/components/race/leaderboard';
import { RaceInfo } from '@/components/race/race-info';

export const metadata: Metadata = {
  title: 'Sloth Race',
  description:
    'Compete in the Sloth Race! Earn points by delegating, restaking, and engaging with the Coreezy community.',
};

export default function SlothRacePage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Coming Soon Banner */}
          <div className="mb-8 p-4 rounded-xl bg-amber-900/30 border border-amber-700/50 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold mb-2">
              Coming Soon
            </span>
            <p className="text-amber-200 font-medium">
              The Sloth Race launches <strong>April 1st, 2026</strong>
            </p>
            <p className="text-sm text-amber-300/70 mt-1">
              3-month racing season matching our partner rewards distribution schedule
            </p>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              🦥 The Sloth Race
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Slow and steady wins the race. Compete by delegating, restaking, and
              staying active.
            </p>
          </div>

          {/* Class Badges */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <div className="card p-4 text-center">
              <div className="text-3xl mb-2">🍼</div>
              <div className="font-bold text-amber-400">Baby Sloth</div>
              <div className="text-xs text-coreezy-400">Bottom 33%</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl mb-2">🌿</div>
              <div className="font-bold text-emerald-400">Teen Sloth</div>
              <div className="text-xs text-coreezy-400">Middle 33%</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl mb-2">🌳</div>
              <div className="font-bold text-canopy-400">Adult Sloth</div>
              <div className="text-xs text-coreezy-400">Top 33%</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <Leaderboard />
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <RaceInfo />
            </div>
          </div>
        </div>
    </div>
  );
}
