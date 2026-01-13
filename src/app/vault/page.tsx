import { Metadata } from 'next';
import Link from 'next/link';
import { VaultDashboard } from '@/components/vault/vault-dashboard';
import {
  Sprout,
  TreeDeciduous,
  CheckCircle,
  AlertCircle,
  Server,
  Building2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vault Dashboard',
  description:
    'Track the Coreezy community vault - The heart of the Coreezy ecosystem with transparent reward distributions.',
};

export default function VaultPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Community Vault
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              The heart of the Coreezy ecosystem
            </p>
          </div>

          <VaultDashboard />

          {/* Vault Mechanics */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6">
              Vault Mechanics
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Initial Phase */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-amber-900/30">
                    <Sprout className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-coreezy-100">
                      5A. Initial Phase
                    </h3>
                    <span className="text-xs text-amber-400">Current</span>
                  </div>
                </div>
                <p className="text-sm text-coreezy-400 mb-4">
                  Before COREZ reaches 1 COREZ = 1.5 Coreum backing
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/50">
                    <span className="text-coreezy-300">Reinvestment into Vault</span>
                    <span className="text-canopy-400 font-bold">50%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/50">
                    <span className="text-coreezy-300">OG NFT Reward Pool</span>
                    <span className="text-canopy-400 font-bold">40%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/50">
                    <span className="text-coreezy-300">Marketing & Development</span>
                    <span className="text-canopy-400 font-bold">10%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/30 opacity-50">
                    <span className="text-coreezy-500">COREZ Holder Drip</span>
                    <span className="text-coreezy-500">0%</span>
                  </div>
                </div>
              </div>

              {/* Final Phase */}
              <div className="card p-6 border-canopy-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-canopy-900/30">
                    <TreeDeciduous className="w-6 h-6 text-canopy-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-coreezy-100">
                      5B. Final Phase
                    </h3>
                    <span className="text-xs text-coreezy-500">Future</span>
                  </div>
                </div>
                <p className="text-sm text-coreezy-400 mb-4">
                  When we have converted our 10% supply to Coreum (1 COREZ = 1.5 Coreum)
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-canopy-900/20 border border-canopy-700/30">
                    <span className="text-coreezy-300">
                      Buyback & Reward Drip
                      <span className="text-xs text-coreezy-500 ml-1">
                        (Long-Term Holding)
                      </span>
                    </span>
                    <span className="text-canopy-400 font-bold">50%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/50">
                    <span className="text-coreezy-300">OG NFT Reward Pool</span>
                    <span className="text-canopy-400 font-bold">20%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/50">
                    <span className="text-coreezy-300">Reinvestment into Vault</span>
                    <span className="text-canopy-400 font-bold">15%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-coreezy-800/50">
                    <span className="text-coreezy-300">Marketing & Development</span>
                    <span className="text-canopy-400 font-bold">10%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-amber-900/20 border border-amber-700/30">
                    <span className="text-coreezy-300">
                      2nd Series NFT Holders
                      <span className="text-xs text-coreezy-500 ml-1">(New)</span>
                    </span>
                    <span className="text-amber-400 font-bold">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Validator Mechanics */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6">
              5C. Validator Mechanics
            </h2>
            <div className="card p-6">
              <p className="text-coreezy-300 mb-6">
                The Coreezy Vibes Validator now fuels the Vault in two ways:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-coreezy-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Server className="w-5 h-5 text-canopy-400" />
                    <h3 className="font-semibold text-coreezy-100">
                      Validator Rewards
                    </h3>
                  </div>
                  <p className="text-sm text-coreezy-300">
                    <strong className="text-canopy-400">10%</strong> of all validator
                    rewards and commissions are funneled directly into the Coreezy
                    Vault. This strengthens long-term sustainability by providing
                    steady on-chain revenue.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-coreezy-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-canopy-400" />
                    <h3 className="font-semibold text-coreezy-100">
                      Business Revenue
                    </h3>
                  </div>
                  <p className="text-sm text-coreezy-300">
                    <strong className="text-canopy-400">10%</strong> of net profit
                    generated by all businesses operating under Coreezy Vibes LLC. As
                    the brand expands, those earnings flow back to the community.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm text-coreezy-400">
                Together, these two revenue streams add continuous fuel to the Vault,
                reinforcing growth, deepening utility, and tying the entire Coreezy
                ecosystem to real performance, not speculation.
              </p>
            </div>
          </section>

          {/* Ecosystem Growth */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6">
              5D. Ecosystem Growth & Reward Circulation
            </h2>
            <div className="card p-6">
              <p className="text-coreezy-300 mb-4">
                This structure ensures the vault grows over time, rewards stay
                circulating among engaged holders, and the community benefits at every
                step.
              </p>
              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/50">
                <h3 className="font-semibold text-amber-300 mb-2">
                  2nd NFT Series Launch Trigger
                </h3>
                <p className="text-sm text-coreezy-300">
                  The 2nd NFT series should launch about the same time we hit{' '}
                  <strong className="text-amber-400">1 COREZ = 1.5 Coreum</strong>. When
                  this happens, reinvestment to vault goes to 10% and 5% is allocated
                  to 2nd Series NFT holders.
                </p>
                <p className="text-sm text-coreezy-400 mt-2">
                  A portion of the funds will be directed to the artist behind the 2nd
                  Series NFT Project. Exact % TBD. Project currently under development.
                </p>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6">
              Drip Reward Eligibility
            </h2>
            <div className="card p-6">
              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/50 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-300 mb-1">Important</h3>
                    <p className="text-sm text-coreezy-300">
                      Drip Rewards for Token holders do not start until the 10% COREZ
                      supply has converted from COREZ to Coreum. This will begin when{' '}
                      <strong className="text-amber-400">1 COREZ = 1.5 Coreum</strong>,
                      providing the vault with a boost of more than 1.5 million Coreum.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                Minimum Holder Requirement
              </h3>
              <ul className="space-y-3 text-coreezy-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-canopy-400 flex-shrink-0" />
                  <span>
                    Hold at least{' '}
                    <strong className="text-coreezy-100">10,000 COREZ</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-canopy-400 flex-shrink-0" />
                  <span>
                    Tokens must be held{' '}
                    <strong className="text-coreezy-100">on-chain</strong>
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-coreezy-400">
                This ensures that rewards go to active and committed community members,
                preventing dust-wallet farming and strengthening the ecosystem.
              </p>
              <div className="mt-4 p-3 rounded bg-coreezy-800/50 text-xs text-coreezy-500">
                <strong className="text-coreezy-400">CEX Note:</strong> If we hit a CEX,
                there are no guaranteed payouts to token holders on the CEX. We will
                work with the CEX in an attempt to ensure everyone that qualifies for
                rewards earns them.
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="mt-12 p-4 rounded-lg bg-coreezy-800/30 border border-coreezy-700">
            <p className="text-xs text-coreezy-500 text-center">
              The vault mechanics and distribution percentages are designed as outlined
              in the Coreezy White Paper. All distributions are handled transparently.
              Smart contracts and wallets are open-source and verifiable.
            </p>
          </div>
        </div>
    </div>
  );
}
