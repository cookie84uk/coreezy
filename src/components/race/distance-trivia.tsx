'use client';

import { useMemo } from 'react';
import { MapPin, Trophy, Sparkles, Target } from 'lucide-react';
import { generateDistanceTrivia, getNextMilestone, formatJourneyComparison } from '@/lib/sloth-trivia';

interface DistanceTriviaProps {
  distanceMeters: number;
  daysActive: number;
}

export function DistanceTrivia({ distanceMeters, daysActive }: DistanceTriviaProps) {
  const trivia = useMemo(
    () => generateDistanceTrivia(distanceMeters, daysActive),
    [distanceMeters, daysActive]
  );
  
  const nextMilestone = useMemo(
    () => getNextMilestone(distanceMeters),
    [distanceMeters]
  );

  if (!trivia.journey) return null;

  const journeyText = formatJourneyComparison(trivia);
  const progressPercent = Math.min(100, trivia.journey.percentComplete);

  return (
    <div className="card p-4 space-y-4">
      {/* Achievement Badge */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-amber-900/30 text-amber-400">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-coreezy-100">{trivia.achievement.title}</div>
          <div className="text-xs text-coreezy-400">{trivia.achievement.description}</div>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-canopy-400" />
          <span className="text-coreezy-300">{journeyText}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-coreezy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-canopy-600 to-canopy-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Journey markers */}
          <div className="flex justify-between mt-1 text-xs text-coreezy-500">
            <span>{trivia.journey.from}</span>
            <span>{trivia.journey.to}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-coreezy-400 pt-1">
          <span>
            {formatDistance(distanceMeters)} traveled
          </span>
          <span>
            {formatDistance(trivia.journey.totalDistance - distanceMeters)} to go
          </span>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && progressPercent < 90 && (
        <div className="flex items-center gap-2 p-2 rounded bg-coreezy-800/50 text-xs">
          <Target className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-coreezy-400">
            Next: <span className="text-coreezy-200">{nextMilestone.from} → {nextMilestone.to}</span>
            <span className="text-coreezy-500 ml-1">
              ({formatDistance(nextMilestone.remaining)} away)
            </span>
          </span>
        </div>
      )}

      {/* Fun Fact */}
      <div className="flex items-start gap-2 p-2 rounded bg-amber-900/20 border border-amber-800/30 text-xs">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="text-amber-200/80">{trivia.funFact}</span>
      </div>

      {/* Sloth Speed Info */}
      <div className="text-center text-xs text-coreezy-500">
        A real sloth could complete this journey in ~{trivia.daysToComplete} days
      </div>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters >= 1000000) {
    return (meters / 1000000).toFixed(1) + 'M km';
  }
  if (meters >= 1000) {
    return (meters / 1000).toFixed(2) + ' km';
  }
  return meters.toFixed(0) + ' m';
}
