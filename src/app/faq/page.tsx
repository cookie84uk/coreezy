import { Metadata } from 'next';
import { HelpCircle, MessageCircle, Twitter, ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'FAQ | Coreezy',
  description:
    'Frequently asked questions about Coreezy - staking, COREZ token, Sloth Race, and more.',
};

interface FAQItem {
  q: string;
  a: ReactNode;
}

interface FAQSection {
  title: string;
  questions: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: 'General',
    questions: [
      {
        q: 'What is Coreezy?',
        a: 'Coreezy is a community-driven ecosystem on Coreum blockchain. We operate a validator, issue the COREZ token, run NFT collections, and gamify staking through the Sloth Race.',
      },
      {
        q: 'What blockchain is Coreezy built on?',
        a: 'Coreezy is built entirely on Coreum, an enterprise-grade Layer-1 blockchain with smart tokens and high throughput.',
      },
      {
        q: 'Is Coreezy a registered company?',
        a: 'Yes, Coreezy Vibes LLC is registered in Wyoming, USA. This provides clear legal structure for our validator operations.',
      },
    ],
  },
  {
    title: 'Staking & Validator',
    questions: [
      {
        q: 'How do I stake with Coreezy?',
        a: 'Go to your wallet (Keplr or Leap), select Stake, and search for "Coreezy". Select our validator and delegate your COREUM.',
      },
      {
        q: 'What is the commission rate?',
        a: 'Our commission rate is 2%, which is competitive and helps fund infrastructure, community programs, and vault growth.',
      },
      {
        q: 'What happens if the validator goes down?',
        a: 'We use enterprise Zeeve infrastructure with redundancy. In the unlikely event of slashing, we have documented incident response procedures. However, staking always carries some risk.',
      },
      {
        q: 'How often are rewards distributed?',
        a: 'Staking rewards accrue continuously on Coreum. You can claim them at any time through your wallet or staking interface.',
      },
    ],
  },
  {
    title: 'COREZ Token',
    questions: [
      {
        q: 'What is COREZ?',
        a: 'COREZ is your community passport token. It grants vault drip eligibility, Sloth Race boosts, and access to partner perks.',
      },
      {
        q: 'How do I get COREZ?',
        a: (
          <>
            Navigate to the DEX on{' '}
            <a
              href="https://cruisecontrol.zone/swap?from=ucore&to=corez-coreezyvibes.coreezy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-canopy-400 hover:underline"
            >
              Cruise Control
            </a>
            . Always verify the contract address before trading.
          </>
        ),
      },
      {
        q: 'When do COREZ holders get vault drip?',
        a: 'Vault drip activates in the Final Phase when the backing ratio reaches target. Currently we are in Initial Phase where rewards go to reinvestment and NFT holders.',
      },
    ],
  },
  {
    title: 'Sloth Race',
    questions: [
      {
        q: 'What is the Sloth Race?',
        a: 'The Sloth Race is our gamified staking system. Earn points daily based on your delegation, restaking, site visits, and social engagement.',
      },
      {
        q: 'How is my score calculated?',
        a: 'Base score is your delegation (capped at 50K CORE). Bonuses: +10% for restaking, +2% for site visits, up to +15% for social boosts.',
      },
      {
        q: 'What are the sloth classes?',
        a: 'Baby Sloth (bottom 33%), Teen Sloth (middle 33%), Adult Sloth (top 33%). Classes are determined at the start of each race season and remain fixed for the duration of that season.',
      },
      {
        q: 'What happens if I undelegate?',
        a: 'Undelegating puts your sloth to "sleep" for 3 days, earning 0 points. Stay staked to stay awake!',
      },
      {
        q: 'How do I get social boosts?',
        a: 'Share about Coreezy on social media, then submit a boost request with the link. If approved, you get a temporary score multiplier.',
      },
    ],
  },
  {
    title: 'NFTs',
    questions: [
      {
        q: 'What NFT collections does Coreezy have?',
        a: 'OG Canopy Collection (100 NFTs, sold out) and Cub Collection (coming soon). OG holders receive 40% of vault distributions in Initial Phase.',
      },
      {
        q: 'How do I claim NFT rewards?',
        a: 'NFT rewards auto-drip directly to your wallet - no claiming required. Rewards are distributed automatically to all eligible NFT holders.',
      },
      {
        q: 'Do NFTs give Sloth Race boosts?',
        a: 'Yes! OG Canopy holders get +15% permanent score boost, Cub Collection holders get +5%.',
      },
    ],
  },
  {
    title: 'Security',
    questions: [
      {
        q: 'Is Coreezy safe?',
        a: 'We use enterprise Zeeve infrastructure for our validator. However, all cryptocurrency activities carry risk. Never invest more than you can afford to lose.',
      },
      {
        q: 'Will Coreezy ever DM me?',
        a: 'No. Coreezy team will NEVER DM you first or ask for your seed phrase. Always verify announcements in official channels.',
      },
      {
        q: 'How can I verify official links?',
        a: (
          <>
            Official channels:{' '}
            <a href="https://coreezy.xyz" target="_blank" rel="noopener noreferrer" className="text-canopy-400 hover:underline">
              coreezy.xyz
            </a>
            ,{' '}
            <a href="https://x.com/CoreezyVibes" target="_blank" rel="noopener noreferrer" className="text-canopy-400 hover:underline">
              @CoreezyVibes on X
            </a>
            , and our{' '}
            <a href="https://t.me/+hh333N0pTRFjNjIx" target="_blank" rel="noopener noreferrer" className="text-canopy-400 hover:underline">
              pinned Telegram links
            </a>
            . When in doubt, ask in the community.
          </>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-canopy-900/50">
                <HelpCircle className="w-8 h-8 text-canopy-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Everything you need to know about Coreezy
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-12">
            {FAQ_SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-canopy-400 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((item, i) => (
                    <details key={i} className="card group">
                      <summary className="p-4 cursor-pointer list-none flex items-center justify-between">
                        <span className="font-medium text-coreezy-100 pr-4">{item.q}</span>
                        <ChevronDown className="w-5 h-5 text-coreezy-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-4 pb-4 text-sm text-coreezy-400">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 card p-8 text-center">
            <h2 className="text-xl font-bold text-coreezy-100 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-coreezy-400 mb-6">
              Join our community and ask directly!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://t.me/+hh333N0pTRFjNjIx"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Telegram
              </a>
              <a
                href="https://x.com/CoreezyVibes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-6 py-2 flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                X / Twitter
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
