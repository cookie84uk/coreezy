import { Metadata } from 'next';
import Link from 'next/link';
import {
  Handshake,
  DollarSign,
  Gift,
  Megaphone,
  Trophy,
  Zap,
  Shield,
  ArrowLeftRight,
  ArrowRight,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Partners | Coreezy',
  description:
    'Coreezy ecosystem partners - projects building together on Coreum.',
};

const PARTNERS = [
  {
    name: 'Coreum',
    category: 'Blockchain',
    description:
      'The enterprise-grade Layer-1 blockchain powering the Coreezy ecosystem with smart tokens and high throughput.',
    Icon: Zap,
    url: 'https://coreum.com',
    perks: 'Foundation of our validator operations',
  },
  {
    name: 'Zeeve',
    category: 'Infrastructure',
    description:
      'Enterprise blockchain infrastructure provider managing our validator nodes with 24/7 monitoring and support.',
    Icon: Shield,
    url: 'https://zeeve.io',
    perks: '99.9%+ uptime SLA',
  },
  {
    name: 'Cruise Control',
    category: 'Ecosystem',
    description:
      'Building and supporting projects across the Coreum ecosystem with shared community values.',
    Icon: ArrowLeftRight,
    url: '#',
    perks: 'Ecosystem collaboration',
  },
];

const DELEGATION_PARTICIPANTS = [
  { name: 'Money Grabbers', url: '#' },
  { name: 'Xmeme', url: '#' },
  { name: 'Farmer Union', url: '#' },
  { name: 'Chain Plate', url: '#' },
  { name: 'Black Market Dawgs', url: '#' },
];

const BECOME_PARTNER = [
  {
    Icon: DollarSign,
    title: 'Revenue Sharing',
    description: 'Earn a share of validator commission by referring delegators.',
  },
  {
    Icon: Gift,
    title: 'Community Perks',
    description: 'Offer exclusive benefits to Coreezy community members.',
  },
  {
    Icon: Megaphone,
    title: 'Cross-Promotion',
    description: 'Gain exposure to our engaged community of stakers.',
  },
  {
    Icon: Trophy,
    title: 'Race Rewards',
    description: 'Sponsor Sloth Race seasons with custom prizes.',
  },
];

export default function PartnersPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Ecosystem Partners
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Building together on Coreum
            </p>
          </div>

          {/* Current Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Handshake className="w-6 h-6" />
              Our Partners
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card p-6 hover:border-canopy-500/50 transition-all group ${partner.url === '#' ? 'pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-coreezy-800 group-hover:bg-canopy-900/50 transition-colors">
                      <partner.Icon className="w-6 h-6 text-canopy-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-coreezy-100">{partner.name}</h3>
                      <span className="text-xs text-canopy-400">{partner.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-coreezy-400 mb-4">{partner.description}</p>
                  <div className="text-xs text-coreezy-500 pt-4 border-t border-coreezy-700/50">
                    {partner.perks}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Delegation Participants */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-2 flex items-center gap-3">
              <Users className="w-6 h-6" />
              Delegation Participants
            </h2>
            <p className="text-coreezy-400 mb-6">
              Projects that have elected to delegate stake to Coreezy under transparent, non-custodial revenue-sharing arrangements.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {DELEGATION_PARTICIPANTS.map((project) => (
                <div
                  key={project.name}
                  className="card p-4 text-center hover:border-canopy-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-coreezy-800 mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-6 h-6 text-coreezy-400" />
                  </div>
                  <h3 className="font-medium text-coreezy-100 text-sm">{project.name}</h3>
                </div>
              ))}
            </div>
            <p className="text-xs text-coreezy-500 mt-4">
              Delegation relationships do not grant control over validator operations, governance decisions, or reward distribution mechanics beyond protocol rules.
            </p>
          </section>

          {/* Partner Benefits */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6" />
              Partnership Benefits
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BECOME_PARTNER.map((benefit) => (
                <div key={benefit.title} className="card p-5">
                  <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-3">
                    <benefit.Icon className="w-6 h-6 text-canopy-400" />
                  </div>
                  <h3 className="font-bold text-coreezy-100 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-coreezy-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="card p-8 text-center bg-canopy-900/30 border-canopy-700/50">
              <h2 className="text-2xl font-bold text-coreezy-100 mb-4 flex items-center justify-center gap-3">
                <Handshake className="w-6 h-6" />
                Become a Partner
              </h2>
              <p className="text-coreezy-300 mb-6 max-w-xl mx-auto">
                Interested in partnering with Coreezy? We&apos;re always looking for projects
                that align with our values of transparency, community, and sustainable growth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://t.me/+hh333N0pTRFjNjIx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3 flex items-center gap-2"
                >
                  Contact Us on Telegram <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/institutional" className="btn-outline px-6 py-3">
                  Institutional Inquiries
                </Link>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
