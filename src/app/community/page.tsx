import { Metadata } from 'next';
import Link from 'next/link';
import {
  MessageCircle,
  Twitter,
  Gamepad2,
  Trophy,
  Palette,
  Gift,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community | Coreezy',
  description:
    'Join the Coreezy community - connect with fellow sloths, participate in events, and grow together.',
};

const PARTNERS = [
  {
    name: 'Coreum',
    description: 'Enterprise-grade blockchain powering the Coreezy ecosystem.',
    icon: Zap,
    url: 'https://coreum.com',
  },
  {
    name: 'Zeeve',
    description: 'Professional node infrastructure provider.',
    icon: Shield,
    url: 'https://zeeve.io',
  },
];

const SOCIAL_LINKS = [
  {
    name: 'Telegram',
    description: 'Main community chat for discussions and support.',
    Icon: MessageCircle,
    url: 'https://t.me/+hh333N0pTRFjNjIx',
    members: '100+',
  },
  {
    name: 'X / Twitter',
    description: 'Official announcements and updates.',
    Icon: Twitter,
    url: 'https://x.com/CoreezyVibes',
    members: '1.2K',
  },
  {
    name: 'Discord',
    description: 'Coming soon - exclusive holder channels.',
    Icon: Gamepad2,
    url: '#',
    members: 'Soon',
  },
];

const ACTIVITIES = [
  {
    Icon: Trophy,
    title: 'Sloth Race',
    description: 'Compete in our gamified staking competition.',
    link: '/sloth-race',
    linkText: 'Join the Race',
  },
  {
    Icon: Palette,
    title: 'NFT Collections',
    description: 'Exclusive Canopy Collection with real utility.',
    link: '/nfts',
    linkText: 'View Collections',
  },
  {
    Icon: Gift,
    title: 'Merch Coming Soon',
    description: 'With Exclusive Rewards',
    link: '/community',
    linkText: 'Stay Tuned',
  },
];

export default function CommunityPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Welcome to the Canopy 🌳
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Join thousands of sloths building, staking, and growing together
            </p>
          </div>

          {/* Social Links */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6" />
              Connect With Us
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card p-6 transition-all hover:border-canopy-500/50 ${
                    social.url === '#' ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-coreezy-800">
                      <social.Icon className="w-6 h-6 text-canopy-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-coreezy-100">{social.name}</h3>
                      <span className="text-xs text-canopy-400">{social.members} members</span>
                    </div>
                  </div>
                  <p className="text-sm text-coreezy-400">{social.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Community Activities */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              Get Involved
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACTIVITIES.map((activity) => (
                <div key={activity.title} className="card p-5">
                  <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-3">
                    <activity.Icon className="w-6 h-6 text-canopy-400" />
                  </div>
                  <h3 className="font-bold text-coreezy-100 mb-2">{activity.title}</h3>
                  <p className="text-sm text-coreezy-400 mb-4">{activity.description}</p>
                  <Link href={activity.link} className="text-sm text-canopy-400 hover:text-canopy-300 flex items-center gap-1">
                    {activity.linkText} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Community Stats */}
          <section className="mb-16">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-6 text-center">
                Community by the Numbers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-canopy-400">85</div>
                  <div className="text-sm text-coreezy-400">Delegators</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-canopy-400">100</div>
                  <div className="text-sm text-coreezy-400">OG NFT Holders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-canopy-400">50K</div>
                  <div className="text-sm text-coreezy-400">COREUM in Vault</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold text-canopy-400">
                    <Clock className="w-6 h-6" />
                    24/7
                  </div>
                  <div className="text-sm text-coreezy-400">Community Support</div>
                </div>
              </div>
            </div>
          </section>

          {/* Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6" />
              Ecosystem Partners
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-6 hover:border-canopy-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-coreezy-800">
                      <partner.icon className="w-6 h-6 text-canopy-400" />
                    </div>
                    <h3 className="font-bold text-coreezy-100">{partner.name}</h3>
                  </div>
                  <p className="text-sm text-coreezy-400">{partner.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Community Guidelines */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Community Guidelines
            </h2>
            <div className="card p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-coreezy-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-canopy-400" />
                    Do
                  </h3>
                  <ul className="space-y-2 text-sm text-coreezy-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-canopy-500 mt-0.5 flex-shrink-0" />
                      Be respectful and supportive
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-canopy-500 mt-0.5 flex-shrink-0" />
                      Share knowledge and help newcomers
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-canopy-500 mt-0.5 flex-shrink-0" />
                      Report bugs and provide feedback
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-canopy-500 mt-0.5 flex-shrink-0" />
                      Verify information before sharing
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-canopy-500 mt-0.5 flex-shrink-0" />
                      Use official channels for support
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-coreezy-100 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    Don&apos;t
                  </h3>
                  <ul className="space-y-2 text-sm text-coreezy-300">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Spam, scam, or promote other projects
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Share financial advice
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Harass or attack other members
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Share private keys or seed phrases
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Impersonate team members
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-amber-900/20 border border-amber-700/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-300">
                  Coreezy team will <strong>never</strong> DM you first or ask for your seed phrase.
                  Always verify announcements in official channels.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="card p-8 text-center bg-canopy-900/30 border-canopy-700/50">
              <h2 className="text-2xl font-bold text-coreezy-100 mb-4">
                Ready to Join the Canopy?
              </h2>
              <p className="text-coreezy-300 mb-6 max-w-xl mx-auto">
                Start by delegating to our validator and joining the community channels.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/validator" className="btn-primary px-6 py-3">
                  Stake with Coreezy
                </Link>
                <a
                  href="https://t.me/+hh333N0pTRFjNjIx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-6 py-3"
                >
                  Join Telegram
                </a>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
