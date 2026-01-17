import { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { Sparkles, Crown, Gift, Image, Star, Users, Palette, Globe, Link2, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NFT Collections | Canopy Collection',
  description:
    'Explore the Coreezy NFT collections - exclusive digital collectibles with real utility tied to vault rewards.',
};

const OG_COLLECTION = {
  id: 'og-canopy',
  name: 'OG Collection',
  description:
    'The original 100 hand-crafted sloths. OG NFT holders receive vault rewards and represent cultural status as early supporters.',
  supply: 100,
  minted: 100,
  status: 'SOLD_OUT' as const,
  rewards: {
    initial: '40% of vault rewards',
    final: '20% of vault rewards (perpetual)',
  },
  perks: [
    'Proceeds seed the Vault prior to milestone achievement',
    'Unlock perpetual access to vault rewards (20% in Final Phase)',
    'Cultural status: proof you were here from the very beginning',
    'Early access to future drops',
    'Exclusive Discord role & IRL event invitations',
  ],
};

const FUTURE_COLLECTION = {
  id: 'future-series',
  name: 'Cub Collection (Coming Soon)',
  description:
    'The Cub Collection launches when COREZ reaches 1.5 million COREUM backing. A portion of proceeds goes directly to the artists who develop them.',
  supply: 'TBD',
  minted: 0,
  status: 'COMING_SOON' as const,
  rewards: '5% of vault rewards (Final Phase)',
  perks: [
    'Tied to the Coreezy Vault alongside OG Collection',
    '5% of vault rewards allocated to holders',
    'A portion of proceeds goes to the artists',
    'Ensures every NFT adds to the ecosystem',
    'Stays connected to token growth',
  ],
};

export default function NFTsPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              NFT Ecosystem
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Exclusive NFTs tied directly to the Coreezy vault and rewards
            </p>
          </div>

          {/* OG Collection */}
          <section className="mb-12">
            <div className="card overflow-hidden border-canopy-700/50">
              {/* Header */}
              <div className="p-6 bg-coreezy-800/50">
                <div className="flex items-center justify-between mb-4">
                  <NextImage src="/logo.png" alt="OG Collection" width={80} height={80} className="rounded-xl" />
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-canopy-900/50 text-canopy-300 border border-canopy-700">
                      Sold Out
                    </span>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-amber-400">OG Status</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-coreezy-100">
                  {OG_COLLECTION.name}
                </h2>
                <p className="text-sm text-coreezy-400 mt-2">
                  {OG_COLLECTION.description}
                </p>
              </div>

              {/* Stats */}
              <div className="p-6 border-t border-coreezy-700/50">
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-canopy-400">
                      {OG_COLLECTION.supply}
                    </div>
                    <div className="text-xs text-coreezy-500">Total Supply</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-canopy-400">
                      {OG_COLLECTION.minted}
                    </div>
                    <div className="text-xs text-coreezy-500">Minted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-canopy-400">0</div>
                    <div className="text-xs text-coreezy-500">Available</div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/50">
                    <div className="text-xs text-amber-400 mb-1 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Initial Phase (Current)
                    </div>
                    <div className="text-lg text-amber-300 font-bold">
                      {OG_COLLECTION.rewards.initial}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-canopy-900/20 border border-canopy-700/50">
                    <div className="text-xs text-canopy-400 mb-1 flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      Final Phase (Perpetual)
                    </div>
                    <div className="text-lg text-canopy-300 font-bold">
                      {OG_COLLECTION.rewards.final}
                    </div>
                  </div>
                </div>

                {/* Perks */}
                <div className="space-y-2">
                  <div className="text-xs text-coreezy-500 flex items-center gap-2">
                    <Gift className="w-3 h-3" />
                    Holder Benefits
                  </div>
                  {OG_COLLECTION.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-coreezy-300"
                    >
                      <span className="w-1.5 h-1.5 bg-canopy-500 rounded-full flex-shrink-0" />
                      {perk}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-coreezy-800/30 border-t border-coreezy-700/50">
                <a
                  href="https://bidds.com/collection/coreezy-vibes-og-nfts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full py-2 justify-center flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  View on Marketplace
                </a>
              </div>
            </div>
          </section>

          {/* Future Collection */}
          <section className="mb-12">
            <div className="card overflow-hidden border-amber-700/30">
              {/* Header */}
              <div className="p-6 bg-coreezy-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-canopy-500/20 flex items-center justify-center">
                    <Palette className="w-10 h-10 text-amber-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-900/50 text-amber-300 border border-amber-700">
                    Coming Soon
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-coreezy-100">
                  {FUTURE_COLLECTION.name}
                </h2>
                <p className="text-sm text-coreezy-400 mt-2">
                  {FUTURE_COLLECTION.description}
                </p>
              </div>

              {/* Launch Trigger */}
              <div className="p-6 border-t border-coreezy-700/50">
                <div className="p-4 rounded-lg bg-coreezy-800/50 mb-6">
                  <div className="text-xs text-coreezy-500 mb-2">Launch Trigger</div>
                  <div className="text-sm text-coreezy-300">
                    The Cub Collection launches after reaching the{' '}
                    <strong className="text-canopy-400">
                      1.5 million Coreum
                    </strong>{' '}
                    milestone. At this point, reinvestment to vault reduces
                    to 15% and 5% is allocated to Cub Collection holders.
                  </div>
                </div>

                {/* Rewards */}
                <div className="p-4 rounded-lg bg-canopy-900/20 border border-canopy-700/50 mb-6">
                  <div className="text-xs text-canopy-400 mb-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Final Phase Allocation
                  </div>
                  <div className="text-lg text-canopy-300 font-bold">
                    {FUTURE_COLLECTION.rewards}
                  </div>
                </div>

                {/* Perks */}
                <div className="space-y-2">
                  <div className="text-xs text-coreezy-500 flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    Collection Features
                  </div>
                  {FUTURE_COLLECTION.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-coreezy-300"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      {perk}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-coreezy-800/30 border-t border-coreezy-700/50">
                <button
                  disabled
                  className="btn-secondary w-full py-2 opacity-50 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </section>

          {/* How NFT Rewards Work */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6" />
              How NFT Rewards Work
            </h2>
            <div className="card p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                    OG Holders
                  </h3>
                  <p className="text-sm text-coreezy-300 mb-4">
                    OG holders receive a proportional share of vault distributions.
                    During the Initial Phase, this is{' '}
                    <strong className="text-canopy-400">40% of rewards</strong>. After
                    reaching the 1.5 million Coreum milestone, OG holders receive{' '}
                    <strong className="text-canopy-400">20% perpetually</strong>.
                  </p>
                  <div className="p-3 rounded bg-coreezy-800/50">
                    <div className="text-xs text-coreezy-500 mb-1">
                      Example Distribution
                    </div>
                    <div className="text-sm text-coreezy-300">
                      If the vault distributes 1,000 COREUM to OG NFT holders, each OG
                      NFT holder receives{' '}
                      <strong className="text-canopy-400">10 COREUM</strong> (1,000 ÷
                      100 NFTs).
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                    Cub Collection Holders
                  </h3>
                  <p className="text-sm text-coreezy-300 mb-4">
                    The OG Collection and Cub Collection are the only NFTs tied to the
                    Coreezy Vault. Cub Collection holders receive{' '}
                    <strong className="text-amber-400">5% of vault rewards</strong>.
                  </p>
                  <div className="p-3 rounded bg-coreezy-800/50">
                    <div className="text-xs text-coreezy-500 mb-1">Artist Support</div>
                    <div className="text-sm text-coreezy-300">
                      A portion of proceeds from the Cub Collection will go
                      directly to the artists who develop them, ensuring creators
                      benefit alongside the community.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Important Note */}
          <section className="mb-12">
            <div className="card p-6 bg-amber-900/10 border-amber-700/30">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-300 mb-2">
                    Vault-Tied Collections
                  </h3>
                  <p className="text-sm text-coreezy-300">
                    The OG Collection and Cub Collection will be the only NFTs tied to
                    the Coreezy Vault. Any vaults, rewards, or benefits tied to these
                    collections are self-contained and explicitly defined, not implied
                    through ownership of other Coreezy assets.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cross-Chain NFT Strategy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6" />
              Cross-Chain NFT Strategy
            </h2>
            <div className="card p-6">
              <p className="text-coreezy-300 mb-6">
                Coreezy is a multi-chain brand by design. While the Coreezy Vault and OG
                NFT collections form the foundation of the Coreezy ecosystem, not all
                Coreezy NFTs will be tied to the original Coreezy Vault.
              </p>
              <p className="text-coreezy-300 mb-6">
                As the brand expands, Coreezy will launch cross-chain NFT collections on
                other networks where it makes strategic sense. These collections may
                operate with independent vaults, reward structures, and distribution
                mechanics, tailored to the strengths and native users of each chain.
              </p>

              {/* XRPL Example */}
              <div className="p-5 rounded-lg bg-coreezy-800/50 border border-coreezy-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-canopy-400" />
                    <h3 className="font-semibold text-coreezy-100">
                      Example: Coreezy Canopy Collection (XRPL)
                    </h3>
                  </div>
                  <a
                    href="https://xrp.cafe/collection/canopy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-canopy-400 hover:text-canopy-300 flex items-center gap-1"
                  >
                    View on XRP Cafe <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-sm text-coreezy-300 mb-4">
                  The Coreezy Canopy Collection, launched on the XRPL, is an example of
                  this model in action. It operates outside the Coreezy Vault.
                </p>
                <div className="mb-4">
                  <div className="text-xs text-coreezy-500 mb-2">Designed to:</div>
                  <ul className="space-y-2 text-sm text-coreezy-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-canopy-500 rounded-full flex-shrink-0" />
                      Expand the Coreezy brand to new ecosystems
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-canopy-500 rounded-full flex-shrink-0" />
                      Experiment with alternative reward mechanics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-canopy-500 rounded-full flex-shrink-0" />
                      Onboard users who may not yet be active on Coreum
                    </li>
                  </ul>
                </div>
                <div className="p-3 rounded bg-coreezy-900/50 text-xs text-coreezy-400">
                  <strong className="text-coreezy-300">Important:</strong> Any vaults,
                  rewards, or benefits tied to cross-chain collections are self-contained
                  and explicitly defined, not implied through ownership of other Coreezy
                  assets.
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <p className="text-coreezy-400 mb-4">
              Want to be notified about the next drop?
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://x.com/CoreezyVibes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2"
              >
                Follow on X
              </a>
              <a
                href="https://t.me/+hh333N0pTRFjNjIx"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-6 py-2"
              >
                Join Telegram
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
