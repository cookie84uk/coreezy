import { Metadata } from 'next';
import { HoldingsDashboard } from '@/components/holdings/holdings-dashboard';

export const metadata: Metadata = {
  title: 'Holdings Dashboard | CORE & COREZ Tracker',
  description:
    'Real-time transparency into Coreezy vault balances, staking totals, NFT rewards, and treasury allocations.',
};

export default function HoldingsPage() {
  return (
    <div className="bg-gradient-jungle py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Holdings Dashboard
          </h1>
          <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
            Real-time transparency into the Coreezy ecosystem
          </p>
        </div>

        <HoldingsDashboard />

        {/* Disclaimer */}
        <div className="mt-12 p-4 rounded-lg bg-coreezy-800/30 border border-coreezy-700">
          <p className="text-xs text-coreezy-500 text-center">
            Data is fetched directly from the Coreum blockchain and updated automatically.
            All balances are verifiable on-chain via{' '}
            <a
              href="https://explorer.coreum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-canopy-400 hover:underline"
            >
              Coreum Explorer
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
