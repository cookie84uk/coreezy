import { Metadata } from 'next';
import Link from 'next/link';
import {
  Coins,
  PieChart,
  Droplets,
  Gift,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Wallet,
  Server,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tokenomics | COREZ Token',
  description:
    'Understand the COREZ token economics - Fixed 10M supply, fair launch distribution, and community vault mechanics.',
};

const DISTRIBUTION = [
  {
    label: 'Community (Fair Launch)',
    percent: 84.98,
    color: 'bg-canopy-500',
    description: 'Distributed via fair launch - no hidden team allocations, no insider advantage',
  },
  {
    label: 'Vault Staking',
    percent: 10,
    color: 'bg-amber-500',
    description: 'Reserved for vault staking (currently ledger controlled, future smart contract)',
  },
  {
    label: 'Marketing & Development',
    percent: 3,
    color: 'bg-emerald-500',
    description: 'Marketing and development wallet for growth initiatives',
  },
  {
    label: 'Founder Purchase',
    percent: 2.02,
    color: 'bg-blue-500',
    description: 'Purchased personally by founder throughout fair launch process',
  },
];

const UTILITY = [
  {
    Icon: Droplets,
    title: 'Vault Drip Rewards',
    description:
      'Earn COREUM rewards when the vault reaches Final Phase (1 COREZ = 1.5 COREUM backing).',
  },
  {
    Icon: Gift,
    title: 'NFT Ecosystem Access',
    description: 'Connect to NFT drops, validator rewards, and partner perks.',
  },
  {
    Icon: Users,
    title: 'Community Membership',
    description: 'Your community passport - proof of belief in the Coreezy ecosystem.',
  },
  {
    Icon: Shield,
    title: 'Vault-Backed Value',
    description: 'Backed by real COREUM in the community vault, not speculation.',
  },
];

export default function TokenomicsPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              COREZ Tokenomics
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Your community passport to the Coreezy ecosystem
            </p>
          </div>

          {/* Token Overview */}
          <div className="card p-8 mb-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  <Coins className="w-6 h-6 text-canopy-400" />
                </div>
                <div className="text-3xl font-bold text-canopy-400">$COREZ</div>
                <div className="text-sm text-coreezy-400">Token Symbol</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <PieChart className="w-6 h-6 text-canopy-400" />
                </div>
                <div className="text-3xl font-bold text-canopy-400">10,000,000</div>
                <div className="text-sm text-coreezy-400">Fixed Total Supply</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Server className="w-6 h-6 text-canopy-400" />
                </div>
                <div className="text-3xl font-bold text-canopy-400">Coreum</div>
                <div className="text-sm text-coreezy-400">Blockchain</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Shield className="w-6 h-6 text-canopy-400" />
                </div>
                <div className="text-3xl font-bold text-canopy-400">Fair Launch</div>
                <div className="text-sm text-coreezy-400">Distribution Model</div>
              </div>
            </div>
          </div>

          {/* Core Principles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Core Principles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4">
                <CheckCircle className="w-5 h-5 text-canopy-400 mb-2" />
                <h3 className="font-semibold text-coreezy-100 mb-1">Fair Launch</h3>
                <p className="text-sm text-coreezy-400">
                  No hidden team allocations, no insider advantage.
                </p>
              </div>
              <div className="card p-4">
                <TrendingUp className="w-5 h-5 text-canopy-400 mb-2" />
                <h3 className="font-semibold text-coreezy-100 mb-1">Rewards by Design</h3>
                <p className="text-sm text-coreezy-400">
                  Vault rewards buy back and grow Coreezy.
                </p>
              </div>
              <div className="card p-4">
                <Users className="w-5 h-5 text-canopy-400 mb-2" />
                <h3 className="font-semibold text-coreezy-100 mb-1">Community-First</h3>
                <p className="text-sm text-coreezy-400">
                  NFTs, merch, and perks tie directly back to holders.
                </p>
              </div>
              <div className="card p-4">
                <Gift className="w-5 h-5 text-canopy-400 mb-2" />
                <h3 className="font-semibold text-coreezy-100 mb-1">Lifestyle Identity</h3>
                <p className="text-sm text-coreezy-400">
                  Beyond crypto - culture you can wear, collect, and share.
                </p>
              </div>
            </div>
          </section>

          {/* Distribution */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <PieChart className="w-6 h-6" />
              Current Distribution
            </h2>
            <div className="card p-6">
              {/* Visual Bar */}
              <div className="h-8 rounded-full overflow-hidden flex mb-6">
                {DISTRIBUTION.map((item) => (
                  <div
                    key={item.label}
                    className={`${item.color} transition-all`}
                    style={{ width: `${item.percent}%` }}
                    title={`${item.label}: ${item.percent}%`}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-4">
                {DISTRIBUTION.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 p-3 rounded-lg bg-coreezy-800/30"
                  >
                    <div className={`w-3 h-3 rounded mt-1 flex-shrink-0 ${item.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-coreezy-200">
                          {item.label}
                        </div>
                        <div className="text-lg font-bold text-coreezy-100">
                          {item.percent}%
                        </div>
                      </div>
                      <div className="text-xs text-coreezy-500 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Vault Backing */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Wallet className="w-6 h-6" />
              COREUM Vault Backing
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                  What is Vault Backing?
                </h3>
                <p className="text-sm text-coreezy-300 mb-4">
                  The Coreezy Community Vault holds COREUM that backs the COREZ token.
                  The target is{' '}
                  <strong className="text-canopy-400">
                    1 COREZ = 1.5 Coreum
                  </strong>{' '}
                  backing. When this milestone is achieved, drip rewards begin for
                  token holders.
                </p>
                <div className="p-4 rounded-lg bg-coreezy-800/50">
                  <div className="text-xs text-coreezy-500 mb-1">Target Milestone</div>
                  <div className="text-2xl font-bold text-canopy-400">
                    1.5 COREUM / COREZ
                  </div>
                  <div className="text-xs text-coreezy-500 mt-1">
                    ~1.5M COREUM for 10% supply (1M COREZ) in vault
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                  How Does Backing Grow?
                </h3>
                <ul className="space-y-2 text-sm text-coreezy-300">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-canopy-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-coreezy-100">10%</strong> of validator
                      rewards and commissions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-canopy-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-coreezy-100">10%</strong> of net profit
                      from all Coreezy Vibes LLC businesses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-canopy-400 mt-0.5 flex-shrink-0" />
                    <span>OG NFT sale proceeds seeding the vault</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-canopy-400 mt-0.5 flex-shrink-0" />
                    <span>Reinvestment from vault distributions (compounding)</span>
                  </li>
                </ul>
                <Link
                  href="/vault"
                  className="btn-ghost mt-4 text-sm flex items-center gap-1"
                >
                  View Vault Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>

          {/* Utility */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6" />
              Token Utility
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {UTILITY.map((item) => (
                <div key={item.title} className="card p-4">
                  <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-2">
                    <item.Icon className="w-5 h-5 text-canopy-400" />
                  </div>
                  <h3 className="font-semibold text-coreezy-100 mb-1">{item.title}</h3>
                  <p className="text-sm text-coreezy-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Drip Eligibility */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Droplets className="w-6 h-6" />
              Drip Reward Eligibility
            </h2>
            <div className="card p-6">
              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/50 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-300 mb-1">
                      Important: Drip rewards do not start until Final Phase
                    </h3>
                    <p className="text-sm text-coreezy-300">
                      Drip rewards for token holders do not begin until the 10% COREZ
                      supply has converted from COREZ to Coreum. This will begin when{' '}
                      <strong className="text-amber-400">1 COREZ = 1.5 Coreum</strong>,
                      providing the vault with a boost of more than 1.5 million Coreum.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                Minimum Holder Requirements
              </h3>
              <ul className="space-y-3 text-coreezy-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-canopy-400 flex-shrink-0" />
                  <span>
                    Hold a minimum of{' '}
                    <strong className="text-coreezy-100">10,000 COREZ</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-canopy-400 flex-shrink-0" />
                  <span>
                    Tokens must be held{' '}
                    <strong className="text-coreezy-100">on-chain</strong> (not on CEX)
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

          {/* Get COREZ */}
          <section>
            <div className="card p-8 text-center bg-coreezy-800/50">
              <h2 className="text-2xl font-bold text-coreezy-100 mb-4 flex items-center justify-center gap-3">
                <Coins className="w-6 h-6" />
                Get COREZ
              </h2>
              <p className="text-coreezy-300 mb-6 max-w-xl mx-auto">
                COREZ is available on Coreum DEXs. Always verify the contract address
                before trading.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://sologenic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-2"
                >
                  Trade on Sologenic
                </a>
                <Link href="/vault" className="btn-outline px-6 py-2">
                  View Vault
                </Link>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
