import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'White Paper | Coreezy',
  description:
    'The Coreezy White Paper - our vision, mission, and roadmap for building a sustainable community on Coreum.',
};

export default function WhitePaperPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Coreezy White Paper
            </h1>
            <p className="text-coreezy-400">Version 1.0 • January 2026</p>
          </div>

          {/* Content */}
          <article className="prose prose-invert prose-coreezy max-w-none">
            {/* Executive Summary */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                Executive Summary
              </h2>
              <p className="text-coreezy-300 leading-relaxed">
                Coreezy is a community-driven ecosystem built on Coreum, designed to reward long-term
                supporters through sustainable validator operations, transparent governance, and innovative
                gamification. Our mission is simple: <strong className="text-coreezy-100">Stake. Vibe. Grow.</strong>
              </p>
              <p className="text-coreezy-300 leading-relaxed mt-4">
                Unlike projects focused on short-term gains, Coreezy embraces the &quot;sloth mentality&quot; —
                patient, deliberate growth that compounds over time. We believe the best returns come to those
                who stake with conviction and contribute to their community.
              </p>
            </section>

            {/* Mission */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                Mission & Values
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100">Mission</h3>
                  <p className="text-coreezy-300">
                    To build the most engaged and rewarded validator community on Coreum through
                    transparency, fair distribution, and genuine utility.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100">Core Values</h3>
                  <ul className="space-y-2 text-coreezy-300">
                    <li className="flex items-start gap-2">
                      <span className="text-canopy-400 font-bold">Patience</span> — We don&apos;t chase hype. Sustainable growth beats quick flips.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-canopy-400 font-bold">Transparency</span> — Every decision, metric, and distribution is public.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-canopy-400 font-bold">Community</span> — Validator rewards flow back to those who support us.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-canopy-400 font-bold">Security</span> — Enterprise-grade infrastructure protects delegator capital.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* The Sloth Philosophy */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                The Sloth Philosophy
              </h2>
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🦥</span>
                <p className="text-coreezy-300">
                  Sloths are often misunderstood. They&apos;re not lazy — they&apos;re energy efficient. They move
                  slowly because they don&apos;t need to rush. They&apos;ve survived for millions of years by
                  conserving resources and avoiding unnecessary risk.
                </p>
              </div>
              <p className="text-coreezy-300">
                This is our investment philosophy. We don&apos;t panic sell. We don&apos;t FOMO buy. We stake
                COREUM, earn rewards, and let compound interest do its work. The Sloth Race gamification
                system rewards this patience — the longer you stake, the more you earn.
              </p>
            </section>

            {/* Ecosystem Components */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                Ecosystem Components
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">
                    1. Coreezy Vibes Validator
                  </h3>
                  <p className="text-coreezy-300 text-sm">
                    Our Coreum mainnet validator secures the network while generating rewards for delegators.
                    Powered by Zeeve infrastructure with 24/7 monitoring and 99.9%+ uptime target.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">
                    2. COREZ Token
                  </h3>
                  <p className="text-coreezy-300 text-sm">
                    Your community passport. COREZ grants governance rights, vault drip eligibility, and
                    access to partner perks. Backed by 1.5M COREUM in the community vault.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">
                    3. Community Vault
                  </h3>
                  <p className="text-coreezy-300 text-sm">
                    A transparent on-chain treasury holding COREUM to back the COREZ token. Distributions
                    flow to NFT holders, COREZ holders (Final Phase), and reinvestment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">
                    4. Canopy Collection NFTs
                  </h3>
                  <p className="text-coreezy-300 text-sm">
                    Limited edition NFTs with real utility — permanent vault reward shares, Sloth Race boosts,
                    and exclusive community access.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">
                    5. Sloth Race
                  </h3>
                  <p className="text-coreezy-300 text-sm">
                    Gamified staking that rewards consistency over size. Daily snapshots track delegation,
                    restaking, and engagement to determine class rankings and rewards.
                  </p>
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                Roadmap
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-canopy-500" />
                    <div className="w-0.5 h-full bg-canopy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-canopy-400">Phase 1: Foundation ✓</h3>
                    <p className="text-sm text-coreezy-400">Q4 2025</p>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Validator launch on Coreum mainnet</li>
                      <li>• COREZ token deployment</li>
                      <li>• OG Canopy NFT mint</li>
                      <li>• Community vault initialization</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    <div className="w-0.5 h-full bg-coreezy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-400">Phase 2: Growth (Current)</h3>
                    <p className="text-sm text-coreezy-400">Q1-Q2 2026</p>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Sloth Race v2 launch</li>
                      <li>• Website rebuild with full integration</li>
                      <li>• Partner project expansion</li>
                      <li>• Smart contract automation</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-coreezy-600" />
                    <div className="w-0.5 h-full bg-coreezy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-coreezy-400">Phase 3: Expansion</h3>
                    <p className="text-sm text-coreezy-400">Q3-Q4 2026</p>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Multi-chain validator expansion</li>
                      <li>• Canopy Cubs NFT collection</li>
                      <li>• Advanced governance features</li>
                      <li>• Institutional partnerships</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-coreezy-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-coreezy-500">Phase 4: Maturity</h3>
                    <p className="text-sm text-coreezy-400">2027+</p>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Full vault drip activation</li>
                      <li>• DAO governance transition</li>
                      <li>• Ecosystem self-sustainability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Disclosure */}
            <section className="card p-8 mb-8 border-amber-700/50">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">
                Risk Disclosure
              </h2>
              <div className="text-sm text-coreezy-400 space-y-3">
                <p>
                  Cryptocurrency investments carry significant risk, including the potential for total loss.
                  Staking involves locking tokens for a period during which market conditions may change.
                </p>
                <p>
                  Validator operations carry inherent risks including slashing (loss of staked tokens) due to
                  downtime or double-signing. While we employ enterprise infrastructure to minimize these risks,
                  they cannot be eliminated entirely.
                </p>
                <p>
                  COREZ token value is not guaranteed. The vault backing ratio provides fundamental value but
                  does not guarantee market price. Always do your own research before investing.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="card p-8 text-center">
              <h2 className="text-xl font-bold text-coreezy-100 mb-4">
                Questions?
              </h2>
              <p className="text-coreezy-300 mb-6">
                Join our community or reach out directly for more information.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://t.me/+hh333N0pTRFjNjIx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-2"
                >
                  Telegram
                </a>
                <a
                  href="https://x.com/CoreezyVibes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-6 py-2"
                >
                  X / Twitter
                </a>
              </div>
            </section>
          </article>
        </div>
    </div>
  );
}
