import { Metadata } from 'next';
import { Twitter, Youtube, Music2, FileText, Rocket, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { BoostRequestForm } from '@/components/race/boost-request-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Request Boost | Sloth Race',
  description:
    'Submit your social media post for a Sloth Race score boost. Share about Coreezy and earn temporary multipliers.',
};

const BOOST_TIERS = [
  {
    platform: 'X / Twitter',
    icon: Twitter,
    iconColor: 'text-sky-400',
    boost: '+5%',
    duration: '7 days',
    requirements: [
      'Must mention @CoreezyVibes',
      'Include #Coreezy hashtag',
      'Minimum 10 engagements',
    ],
  },
  {
    platform: 'YouTube',
    icon: Youtube,
    iconColor: 'text-red-500',
    boost: '+10%',
    duration: '14 days',
    requirements: [
      'Video about Coreezy/Coreum',
      'Minimum 100 views',
      'Link to coreezy.xyz',
    ],
  },
  {
    platform: 'TikTok',
    icon: Music2,
    iconColor: 'text-pink-400',
    boost: '+7%',
    duration: '7 days',
    requirements: [
      'Mention Coreezy',
      'Include relevant tags',
      'Minimum 500 views',
    ],
  },
  {
    platform: 'Article/Blog',
    icon: FileText,
    iconColor: 'text-emerald-400',
    boost: '+15%',
    duration: '30 days',
    requirements: [
      'In-depth coverage',
      'Minimum 500 words',
      'Link back to coreezy.xyz',
    ],
  },
];

// Pre-written tweet templates with intent URLs
const TWEET_TEMPLATES = [
  {
    label: 'Validator Promo',
    text: `Just staked my $CORE with @CoreezyVibes validator! 🌿

Enterprise-grade infrastructure, transparent operations, and the Sloth Race is actually fun.

Slow and steady wins the race.

#Coreezy #Coreum #CORE`,
  },
  {
    label: 'Sloth Race',
    text: `The @CoreezyVibes Sloth Race is live! 🦥

Delegate to Coreezy → Get ranked → Compete for rewards

Top 33% = Adult Sloth
Middle 33% = Teen Sloth  
Bottom 33% = Baby Sloth

Who knew being slow could be so competitive?

#Coreezy #SlothRace #Coreum`,
  },
  {
    label: 'NFT Collection',
    text: `OG NFT holders on @CoreezyVibes are getting real utility 👀

- Automatic CORE rewards from validator earnings
- Cubs Collection coming soon
- Cross-chain expansion to XRPL

This is how NFTs should work.

#Coreezy #CoreumNFT #NFTUtility`,
  },
];

function generateTweetIntent(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export default function BoostRequestPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4 flex items-center justify-center gap-3">
              <Rocket className="w-10 h-10 text-amber-400" />
              Get Boosted
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Share about Coreezy on social media and earn temporary score multipliers
            </p>
          </div>

          {/* Quick Tweet Section */}
          <section className="mb-12">
            <div className="card p-6 border-sky-700/30 bg-sky-950/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-bold text-sky-400">Quick Post to X</h2>
              </div>
              <p className="text-sm text-coreezy-400 mb-4">
                Click a template below to open X with a pre-written post. Customize it to make it your own!
              </p>
              <div className="grid gap-3">
                {TWEET_TEMPLATES.map((template, i) => (
                  <a
                    key={i}
                    href={generateTweetIntent(template.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-coreezy-800/50 hover:bg-coreezy-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-sky-400" />
                      <span className="font-medium text-coreezy-200">{template.label}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-coreezy-500 group-hover:text-sky-400 transition-colors" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-coreezy-500 mt-3">
                After posting, submit the link below for boost verification
              </p>
            </div>
          </section>

          {/* Boost Tiers */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-canopy-400 mb-4">
              Available Boosts
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BOOST_TIERS.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div key={tier.platform} className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-coreezy-800 ${tier.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-coreezy-100">{tier.platform}</h3>
                        <div className="flex gap-3 text-xs">
                          <span className="text-canopy-400 font-semibold">{tier.boost}</span>
                          <span className="text-coreezy-500">for {tier.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {tier.requirements.map((req, i) => (
                        <li key={i} className="text-xs text-coreezy-400 flex items-center gap-2">
                          <span className="w-1 h-1 bg-coreezy-600 rounded-full shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Guidelines */}
          <section className="mb-12">
            <div className="card p-6 border-amber-700/30">
              <h2 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Guidelines
              </h2>
              <ul className="space-y-2 text-sm text-coreezy-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  Content must be original and authentic
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  No fake engagement (bots, paid likes, etc.)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  One boost per platform per month
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  Review takes 24-48 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  Boost activates after approval
                </li>
              </ul>
            </div>
          </section>

          {/* Submit Form */}
          <section>
            <h2 className="text-xl font-bold text-canopy-400 mb-4">
              Submit Boost Request
            </h2>
            <BoostRequestForm />
          </section>

          {/* Article Template */}
          <section className="mt-12">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-emerald-400">Article Template</h2>
              </div>
              <p className="text-sm text-coreezy-400 mb-4">
                Writing about Coreezy? Here are the key points to cover:
              </p>
              <div className="bg-coreezy-800/50 rounded-lg p-4 text-sm text-coreezy-300 space-y-3">
                <div>
                  <strong className="text-coreezy-100">What is Coreezy?</strong>
                  <p className="text-coreezy-400 mt-1">
                    Enterprise-grade Coreum blockchain validator operated by Coreezy Vibes LLC (Wyoming). 
                    Combines institutional-ready infrastructure with community engagement through NFTs, 
                    the COREZ token, and the gamified Sloth Race delegation competition.
                  </p>
                </div>
                <div>
                  <strong className="text-coreezy-100">Key Features:</strong>
                  <ul className="text-coreezy-400 mt-1 list-disc list-inside space-y-1">
                    <li>Enterprise validator with 24/7 monitoring</li>
                    <li>OG NFT collection with automatic reward distribution</li>
                    <li>COREZ ecosystem token with LP backing</li>
                    <li>Sloth Race - gamified staking competition</li>
                    <li>Coreezy Vault reinvestment mechanism</li>
                    <li>Cross-chain NFT strategy (Coreum + XRPL)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-coreezy-100">Links:</strong>
                  <ul className="text-coreezy-400 mt-1 space-y-1">
                    <li>Website: <span className="text-canopy-400">coreezy.xyz</span></li>
                    <li>Twitter/X: <span className="text-canopy-400">@CoreezyVibes</span></li>
                    <li>Validator: <span className="text-canopy-400">Coreezy on Mintscan</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
