import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'White Paper | Coreezy',
  description:
    'The Coreezy White Paper - vision, mechanics, and long-term ecosystem behind the Coreezy project.',
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
          </div>

          {/* Content */}
          <article className="prose prose-invert prose-coreezy max-w-none">
            {/* 1. Introduction */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                1. Introduction
              </h2>
              <p className="text-coreezy-300 leading-relaxed">
                This Coreezy White Paper outlines the vision, mechanics, and long-term ecosystem behind the Coreezy project.
              </p>
              <p className="text-coreezy-300 leading-relaxed mt-4">
                Coreezy is more than a meme coin. It is a community-driven lifestyle brand powered by tokenomics with real impact. Built on Coreum, Coreezy combines the Coreezy Vibes Validator, Reward mechanics, a staking vault, NFTs, and merch to create an ecosystem where culture and finance work together.
              </p>
              <p className="text-coreezy-300 leading-relaxed mt-4">
                Unlike traditional meme tokens, Coreezy is not only about speculation. It is about building a sustainable cycle: a token that rewards, a vault that compounds, NFTs that link directly into rewards, and a brand you can represent in real life.
              </p>
            </section>

            {/* 2. Mission */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                2. Mission
              </h2>
              <p className="text-coreezy-300 leading-relaxed">
                To fuse crypto culture with lifestyle branding through a tokenomics model that rewards community growth, and builds long-term value while keeping it simple, transparent, and community-first.
              </p>
            </section>

            {/* 3. Core Principles */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                3. Core Principles
              </h2>
              <ul className="space-y-3 text-coreezy-300">
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">Fair Launch</span> — No hidden team allocations, no insider advantage.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">Rewards by Design</span> — Vault rewards buy back and Coreezy.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">Community-First</span> — NFTs, merch, and ecosystem perks tie directly back to holders.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">Lifestyle Identity</span> — Coreezy extends beyond crypto. It is culture you can wear, collect, and share.
                </li>
              </ul>
            </section>

            {/* 4. Tokenomics */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                4. Tokenomics
              </h2>
              <div className="mb-6">
                <p className="text-coreezy-300">
                  <strong className="text-coreezy-100">Ticker:</strong> $COREZ
                </p>
                <p className="text-coreezy-300">
                  <strong className="text-coreezy-100">Total Supply:</strong> Fixed 10,000,000 tokens
                </p>
              </div>
              <h3 className="text-lg font-semibold text-coreezy-100 mb-3">Current Distribution:</h3>
              <ul className="space-y-2 text-coreezy-300">
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">10%</span> — Reserved for Vault Staking (Currently ledger controlled, future smart contract allocation)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">3%</span> — Marketing and Development Wallet
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-canopy-400 font-bold">2.02%</span> — Purchased personally by founder throughout fair launch process
                </li>
              </ul>
            </section>

            {/* 5. Vault Mechanics */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                5. Vault Mechanics
              </h2>
              <p className="text-coreezy-300 mb-6">
                The Coreum Vault is the heart of Coreezy&apos;s ecosystem.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">5A. Initial Vault Mechanics</h3>
                  <p className="text-sm text-coreezy-400 mb-2">Vault rewards distributed as follows:</p>
                  <ul className="space-y-1 text-coreezy-300">
                    <li><span className="text-canopy-400 font-bold">50%</span> → Reinvestment into Vault (compounding growth)</li>
                    <li><span className="text-canopy-400 font-bold">10%</span> → Marketing and Development Fund (growth engine)</li>
                    <li><span className="text-canopy-400 font-bold">40%</span> → OG NFT Reward Pool</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">5B. Final Vault Mechanics</h3>
                  <p className="text-sm text-coreezy-400 mb-2">When we have converted our 10% supply to Coreum:</p>
                  <ul className="space-y-1 text-coreezy-300">
                    <li><span className="text-canopy-400 font-bold">50%</span> → Buyback and Reward Drip (Promotes Long-Term Holding)</li>
                    <li><span className="text-canopy-400 font-bold">15%</span> → Reinvestment into Vault (compounding growth)</li>
                    <li><span className="text-canopy-400 font-bold">10%</span> → Marketing and Development Fund (growth engine)</li>
                    <li><span className="text-canopy-400 font-bold">20%</span> → OG NFT Reward Pool</li>
                    <li><span className="text-amber-400 font-bold">5%</span> → Cubs NFT Reward Pool</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">5C. Additional Vault Funding Streams</h3>
                  <p className="text-coreezy-300 mb-3">
                    The Coreezy Vibes Validator now fuels the Vault in two ways.
                  </p>
                  <p className="text-coreezy-300 mb-3">
                    First, <strong className="text-coreezy-100">10 percent of all validator rewards and commissions</strong> are funneled directly into the Coreezy Vault. This strengthens long-term sustainability by providing steady on-chain revenue that supports future distributions for COREZ token holders and NFT collections.
                  </p>
                  <p className="text-coreezy-300">
                    Second, the Vault receives an additional boost from <strong className="text-coreezy-100">10 percent of net profit generated by all businesses operating under Coreezy Vibes LLC</strong>. As the Coreezy brand expands into new projects, partnerships, merch, media, and other ventures, those earnings flow back to the community through the same vault mechanism.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">5D. Ecosystem Growth and Reward Circulation</h3>
                  <p className="text-coreezy-300 mb-3">
                    This structure ensures the vault grows over time, rewards stay circulating among engaged holders, and the community benefits at every step.
                  </p>
                  <p className="text-coreezy-300 mb-3">
                    The Cub Collection should launch about the same time we hit the 1.5 million Coreum milestone. At this point, 5% is allocated to Cub Collection holders.
                  </p>
                  <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/30 mt-4">
                    <p className="text-amber-300 text-sm">
                      <strong>Minimum Holder Requirement for Drip Rewards:</strong> To qualify for drip rewards, wallets must hold a minimum of <strong>10,000 COREZ</strong>. This ensures that rewards go to active and committed community members, preventing dust-wallet farming and strengthening the ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. NFT Ecosystem */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                6. NFT Ecosystem
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3 flex items-center gap-2">
                    <Image src="/logo.png" alt="OG Collection" width={28} height={28} className="rounded-full" /> OG Collection (100 pieces)
                  </h3>
                  <ul className="space-y-2 text-coreezy-300">
                    <li>• Proceeds seed the Vault prior to milestone achievement.</li>
                    <li>• Unlock perpetual access to <strong className="text-coreezy-100">20% of vault rewards</strong> once the project achieves the 1.5 million Coreum milestone.</li>
                    <li>• Represent cultural status: proof you were here from the very beginning.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">Cub Collection</h3>
                  <ul className="space-y-2 text-coreezy-300">
                    <li>• Tied to the Coreezy Vault alongside OG Collection.</li>
                    <li>• <strong className="text-coreezy-100">5% of vault rewards</strong> allocated to Cub Collection holders.</li>
                    <li>• A portion of proceeds will go directly to the artists who develop them, ensuring creators benefit alongside the community.</li>
                    <li>• Ensures every NFT adds to the ecosystem, rewards contributors, and stays connected to token growth.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-3">Cross-Chain NFT Strategy</h3>
                  <p className="text-coreezy-300 mb-3">
                    Coreezy is a multi-chain brand by design. While the Coreezy Vault and OG NFT collections form the foundation of the Coreezy ecosystem, not all Coreezy NFTs will be tied to the original Coreezy Vault.
                  </p>
                  <p className="text-coreezy-300 mb-3">
                    As the brand expands, Coreezy will launch cross-chain NFT collections on other networks where it makes strategic sense. These collections may operate with independent vaults, reward structures, and distribution mechanics, tailored to the strengths and native users of each chain.
                  </p>
                  <div className="p-4 rounded-lg bg-coreezy-800/50 border border-coreezy-700/50 mt-4">
                    <h4 className="font-semibold text-coreezy-100 mb-2">Example: Coreezy Canopy Collection (XRPL)</h4>
                    <p className="text-sm text-coreezy-300 mb-2">
                      The Coreezy Canopy Collection, launched on the XRPL, is an example of this model in action. It operates outside the Coreezy Vault and is designed to:
                    </p>
                    <ul className="space-y-1 text-sm text-coreezy-300">
                      <li>• Expand the Coreezy brand to new ecosystems</li>
                      <li>• Experiment with alternative reward mechanics</li>
                      <li>• Onboard users who may not yet be active on Coreum</li>
                    </ul>
                    <p className="text-xs text-coreezy-400 mt-3">
                      <strong>Important:</strong> Any vaults, rewards, or benefits tied to cross-chain collections are self-contained and explicitly defined, not implied through ownership of other Coreezy assets.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Roadmap */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                7. Roadmap
              </h2>

              <div className="space-y-6">
                {/* Phase 1 - Completed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-canopy-500" />
                    <div className="w-0.5 h-full bg-canopy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-canopy-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Phase 1 – Foundation & Institutional Readiness
                    </h3>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Enterprise-grade Coreum validator launched and operational</li>
                      <li>• Institutional-ready governance, risk, and operational frameworks</li>
                      <li>• Wyoming LLC structure with jurisdiction-aware operations</li>
                      <li>• Transparent on-chain validator operations and reporting</li>
                      <li>• $COREZ token launched as the Coreezy ecosystem token</li>
                      <li>• Coreezy NFT collections launched on Coreum and XRPL</li>
                      <li>• Initial vaults, bonding, and reward distribution mechanisms</li>
                    </ul>
                    <p className="text-xs text-canopy-500 mt-2 italic">
                      Outcome: Coreezy operates as an institutionally-ready validator and ecosystem.
                    </p>
                  </div>
                </div>

                {/* Phase 2 - Current */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
                    <div className="w-0.5 h-full bg-coreezy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" /> Phase 2 – Ecosystem Expansion & Engagement (Current)
                    </h3>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Website refresh with live on-chain data</li>
                      <li>• Expansion of the Coreezy NFT ecosystem</li>
                      <li>• Sloth Race launched as validator engagement and community layer</li>
                      <li>• Free, mutable Sloth NFTs as evolving identity NFTs</li>
                      <li>• Partner, Community, and Institutional dashboards</li>
                      <li>• Coreezy merchandise launch with reward NFT integration</li>
                      <li>• Ongoing validator growth and partnership outreach</li>
                    </ul>
                    <p className="text-xs text-amber-500/70 mt-2 italic">
                      Focus: Engagement, identity, and ecosystem participation.
                    </p>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-coreezy-500" />
                    <div className="w-0.5 h-full bg-coreezy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-coreezy-300">Phase 3 – Platform & Creator Tools</h3>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Expansion of Coreezy&apos;s NFT tooling for creators and partners</li>
                      <li>• Support for flexible NFT configurations across networks</li>
                      <li>• Partner and brand use cases prioritized</li>
                      <li>• Enhanced ecosystem visibility and transparency tools</li>
                    </ul>
                    <p className="text-xs text-coreezy-500 mt-2 italic">
                      Focus: Practical NFT infrastructure for communities and brands.
                    </p>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-coreezy-600" />
                    <div className="w-0.5 h-full bg-coreezy-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-coreezy-400">Phase 4 – Ecosystem & Validator Scale</h3>
                    <ul className="text-sm text-coreezy-300 mt-2 space-y-1">
                      <li>• Expansion of Coreezy validator operations and infrastructure</li>
                      <li>• Strategic partnerships with projects, creators, and institutions</li>
                      <li>• Advanced NFT-based access control, rewards, and identity</li>
                      <li>• Continued ecosystem tooling and platform hardening</li>
                    </ul>
                    <p className="text-xs text-coreezy-500 mt-2 italic">
                      Focus: Scaling responsibly while maintaining operational discipline.
                    </p>
                  </div>
                </div>

                {/* Phase 5 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-coreezy-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-coreezy-500">Phase 5 – Advanced Infrastructure (Exploration)</h3>
                    <ul className="text-sm text-coreezy-400 mt-2 space-y-1">
                      <li>• Research into advanced validator-aligned staking models</li>
                      <li>• Exploration of tokenization and settlement infrastructure</li>
                      <li>• Evaluation of self-custody user experience</li>
                      <li>• Continued refinement of institutional documentation and standards</li>
                    </ul>
                    <p className="text-xs text-coreezy-600 mt-2 italic">
                      Focus: Long-term infrastructure explored deliberately and cautiously.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Governance and Transparency */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                8. Governance and Transparency
              </h2>
              <ul className="space-y-3 text-coreezy-300">
                <li>• Transparent monthly reports on vault rewards, burns, reinvestment, and marketing spend, visible via our website.</li>
                <li>• Community updates and ongoing communication through public dashboards and social channels.</li>
                <li>• Smart contracts and wallets open-source and verifiable.</li>
              </ul>
            </section>

            {/* 9. Legal and Disclaimer */}
            <section className="card p-8 mb-8 border-amber-700/50">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">
                9. Legal and Disclaimer
              </h2>
              <ul className="space-y-3 text-coreezy-300 text-sm">
                <li>• Coreezy Vibes LLC is a community-driven project and lifestyle brand.</li>
                <li>• The token is designed for cultural and ecosystem participation, not as an investment contract.</li>
                <li>• Vault rewards allocated to NFTs are community milestone rewards, not dividends or profit guarantees.</li>
                <li>• Coreezy Vibes LLC (U.S.-based entity) manages branding, merch, and community-facing initiatives.</li>
              </ul>
            </section>

            {/* 10. Risks and Mitigations */}
            <section className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                10. Risks and Mitigations
              </h2>
              <p className="text-coreezy-300 mb-6">
                Coreezy is built with optimism, transparency, and long-term vision, but like any crypto project, it operates within a dynamic and evolving landscape.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">Market Volatility</h3>
                  <p className="text-sm text-coreezy-400 mb-2">
                    <strong>Risk:</strong> Crypto markets are inherently volatile. Token price fluctuations may impact vault growth and community sentiment.
                  </p>
                  <p className="text-sm text-coreezy-300">
                    <strong>Mitigation:</strong> Coreezy&apos;s mechanics, compounding vault, and NFT-linked rewards are designed to create value independent of short-term price action. Community rituals and lifestyle branding reinforce cultural value beyond market cycles.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">Regulatory Uncertainty</h3>
                  <p className="text-sm text-coreezy-400 mb-2">
                    <strong>Risk:</strong> Global regulations around crypto assets, NFTs, and staking mechanisms are evolving.
                  </p>
                  <p className="text-sm text-coreezy-300">
                    <strong>Mitigation:</strong> Coreezy Vibes LLC operates as a U.S.-based lifestyle brand, not a financial institution. Vault rewards are milestone-based community incentives, not dividends or investment returns.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">Centralization (Early Phase)</h3>
                  <p className="text-sm text-coreezy-400 mb-2">
                    <strong>Risk:</strong> Initial vault operations are manually managed via secure ledger control.
                  </p>
                  <p className="text-sm text-coreezy-300">
                    <strong>Mitigation:</strong> A phased roadmap includes smart contract automation and public dashboards. All wallet addresses and vault flows will remain transparent and verifiable throughout.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">NFT Reward Dilution</h3>
                  <p className="text-sm text-coreezy-400 mb-2">
                    <strong>Risk:</strong> As new NFT collections launch, reward percentages may be perceived as diluted.
                  </p>
                  <p className="text-sm text-coreezy-300">
                    <strong>Mitigation:</strong> OG NFTs retain perpetual access to the original reward pool. Future collections are milestone-triggered and artist-supported, ensuring each drop adds value to the ecosystem without subtracting from early supporters.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-coreezy-100 mb-2">Brand Consistency</h3>
                  <p className="text-sm text-coreezy-400 mb-2">
                    <strong>Risk:</strong> As Coreezy Vibes LLC expands into merch, NFTs, and partnerships, brand dilution is a risk.
                  </p>
                  <p className="text-sm text-coreezy-300">
                    <strong>Mitigation:</strong> Coreezy maintains strict visual and thematic guidelines. All merch, media, and community content are curated to reflect the ethos: &quot;We don&apos;t rush. We don&apos;t stress. We stake. We vibe. We grow.&quot;
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="card p-8 mb-8 text-center bg-canopy-900/20 border-canopy-700/50">
              <h2 className="text-2xl font-bold text-canopy-400 mb-4">
                Conclusion
              </h2>
              <p className="text-coreezy-300 leading-relaxed">
                Thank you for reading the Coreezy White Paper where meme culture, sustainable tokenomics, NFTs, and lifestyle branding become one ecosystem. Through the Coreum vault engine, NFTs tied to rewards, artist-supported collections, and real-world branding, Coreezy creates something that lasts: a project where culture fuels growth and growth fuels culture.
              </p>
            </section>

            {/* Legal Footer */}
            <section className="text-center text-xs text-coreezy-500">
              <p className="mb-4">
                This information is for educational and entertainment purposes only and should not be considered financial advice. Cryptocurrency investments are highly volatile and carry a risk of total loss. Always do your own research before making any investment decisions. Past performance is not indicative of future results. You are solely responsible for any trades or investments you make.
              </p>
              <p>
                © 2025 Coreezy Vibes LLC. All rights reserved.<br />
                Coreezy™, Coreezy Vibes™, and related marks are owned by Coreezy Vibes LLC.
              </p>
            </section>
          </article>
        </div>
    </div>
  );
}
