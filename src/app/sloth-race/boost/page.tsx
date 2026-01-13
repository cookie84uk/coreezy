import { Metadata } from 'next';
import { BoostRequestForm } from '@/components/race/boost-request-form';

export const metadata: Metadata = {
  title: 'Request Boost | Sloth Race',
  description:
    'Submit your social media post for a Sloth Race score boost. Share about Coreezy and earn temporary multipliers.',
};

const BOOST_TIERS = [
  {
    platform: 'X / Twitter',
    icon: '🐦',
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
    icon: '▶️',
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
    icon: '🎵',
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
    icon: '📝',
    boost: '+15%',
    duration: '30 days',
    requirements: [
      'In-depth coverage',
      'Minimum 500 words',
      'Link back to coreezy.xyz',
    ],
  },
];

export default function BoostRequestPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              🚀 Get Boosted
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Share about Coreezy on social media and earn temporary score multipliers
            </p>
          </div>

          {/* Boost Tiers */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-canopy-400 mb-4">
              Available Boosts
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BOOST_TIERS.map((tier) => (
                <div key={tier.platform} className="card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <h3 className="font-bold text-coreezy-100">{tier.platform}</h3>
                      <div className="flex gap-3 text-xs">
                        <span className="text-canopy-400">{tier.boost}</span>
                        <span className="text-coreezy-500">for {tier.duration}</span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {tier.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-coreezy-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-coreezy-600 rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Guidelines */}
          <section className="mb-12">
            <div className="card p-6 border-amber-700/30">
              <h2 className="text-lg font-bold text-amber-400 mb-3">
                ⚠️ Guidelines
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
        </div>
    </div>
  );
}
