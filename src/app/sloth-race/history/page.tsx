import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Trophy, Baby, Leaf, TreeDeciduous, Calendar, Users, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Season History | Sloth Race',
  description: 'View historical Sloth Race seasons, winners, and prize distributions.',
};

// This will eventually come from the database
const HISTORICAL_SEASONS = [
  // Example of what a completed season would look like
  // {
  //   id: 'season-1',
  //   name: 'Season 1',
  //   startDate: '2026-04-01',
  //   endDate: '2026-06-30',
  //   totalPool: 15000,
  //   totalParticipants: 150,
  //   distribution: { adult: 60, teen: 30, baby: 10 },
  //   winners: {
  //     adult: [
  //       { rank: 1, address: 'core1abc...xyz', score: 500000, reward: 300 },
  //       { rank: 2, address: 'core1def...uvw', score: 480000, reward: 280 },
  //     ],
  //     teen: [...],
  //     baby: [...],
  //   },
  // },
];

export default function SeasonHistoryPage() {
  return (
    <div className="bg-gradient-jungle py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/sloth-race"
          className="inline-flex items-center gap-2 text-coreezy-400 hover:text-coreezy-200 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sloth Race
        </Link>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gradient mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Season History
          </h1>
          <p className="text-coreezy-300">
            View past seasons, prize distributions, and top performers
          </p>
        </div>

        {/* Current Season Card */}
        <div className="card p-6 mb-8 border-canopy-700/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-canopy-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-canopy-400">CURRENT SEASON</span>
          </div>
          
          <h2 className="text-2xl font-bold text-coreezy-100 mb-2">Season 1</h2>
          
          <div className="flex flex-wrap gap-4 text-sm text-coreezy-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Apr 1 - Jun 30, 2026
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              88 participants
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-canopy-900/20">
              <TreeDeciduous className="w-6 h-6 text-canopy-400 mx-auto mb-1" />
              <div className="text-xs text-coreezy-500">Adult Pool</div>
              <div className="font-bold text-canopy-400">60%</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-emerald-900/20">
              <Leaf className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs text-coreezy-500">Teen Pool</div>
              <div className="font-bold text-emerald-400">30%</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-900/20">
              <Baby className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <div className="text-xs text-coreezy-500">Baby Pool</div>
              <div className="font-bold text-amber-400">10%</div>
            </div>
          </div>

          <Link
            href="/sloth-race"
            className="mt-6 btn-primary w-full py-3 justify-center"
          >
            View Current Leaderboard
          </Link>
        </div>

        {/* Historical Seasons */}
        {HISTORICAL_SEASONS.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-coreezy-200">Past Seasons</h2>
            
            {HISTORICAL_SEASONS.map((season) => (
              <div key={season.id} className="card p-6">
                {/* Season details would go here */}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-coreezy-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-coreezy-300 mb-2">
              No Historical Seasons Yet
            </h3>
            <p className="text-sm text-coreezy-500 max-w-md mx-auto">
              Season 1 is the first Sloth Race! After it ends on June 30, 2026, 
              you&apos;ll be able to view the full results here including prize 
              distributions and top performers in each class.
            </p>
          </div>
        )}

        {/* How Seasons Work */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-coreezy-200 mb-6">How Seasons Work</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="text-canopy-400 font-semibold mb-2">Duration</div>
              <p className="text-sm text-coreezy-400">
                Each season runs for 3 months, matching our partner rewards distribution schedule.
              </p>
            </div>
            <div className="card p-4">
              <div className="text-canopy-400 font-semibold mb-2">Prize Pool</div>
              <p className="text-sm text-coreezy-400">
                1% of validator commission accumulates throughout the quarter into the prize pool.
              </p>
            </div>
            <div className="card p-4">
              <div className="text-canopy-400 font-semibold mb-2">Distribution</div>
              <p className="text-sm text-coreezy-400">
                At season end, the pool is split: 60% to Adults, 30% to Teens, 10% to Babies.
              </p>
            </div>
            <div className="card p-4">
              <div className="text-canopy-400 font-semibold mb-2">Class Lock</div>
              <p className="text-sm text-coreezy-400">
                Classes are assigned at season start and locked. They can only change between seasons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
