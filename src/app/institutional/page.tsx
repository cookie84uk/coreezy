import { Metadata } from 'next';
import { InstitutionalForm } from '@/components/institutional/institutional-form';
import {
  Building2,
  BarChart3,
  Shield,
  Scale,
  Headphones,
  Settings,
  Activity,
  Percent,
  MapPin,
  Server,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Institutional | Coreezy',
  description:
    'Enterprise staking solutions for institutional investors. Professional infrastructure, transparent operations, and dedicated support.',
};

const FEATURES = [
  {
    Icon: Building2,
    title: 'Enterprise Infrastructure',
    description: 'Zeeve-managed nodes with 99.9%+ uptime SLA, multi-region redundancy, and automated failover.',
  },
  {
    Icon: BarChart3,
    title: 'Transparent Reporting',
    description: 'Detailed performance reports, on-chain verification, and customized analytics dashboards.',
  },
  {
    Icon: Shield,
    title: 'Risk Management',
    description: 'Slashing protection policies, incident response procedures, and capital preservation focus.',
  },
  {
    Icon: Scale,
    title: 'Compliance Ready',
    description: 'Wyoming LLC structure, documented governance, and jurisdiction-aware operations.',
  },
  {
    Icon: Headphones,
    title: 'Dedicated Support',
    description: 'Direct communication channels, priority response, and technical integration assistance.',
  },
  {
    Icon: Settings,
    title: 'Custom Solutions',
    description: 'Tailored staking strategies, white-label options, and flexible partnership structures.',
  },
];

const FAQ = [
  {
    q: 'What is the minimum delegation size?',
    a: 'There is no minimum for standard delegation. For custom reporting and dedicated support, we recommend 100,000+ COREUM.',
  },
  {
    q: 'What is your commission rate?',
    a: 'Our standard commission is 2%. We provide premium service with enterprise-grade infrastructure and dedicated support.',
  },
  {
    q: 'How do you handle slashing events?',
    a: 'We maintain enterprise infrastructure with multiple failsafes. In the unlikely event of slashing, we have documented incident response procedures and a reserve policy to protect delegator capital.',
  },
  {
    q: 'Can you provide custody solutions?',
    a: 'We work with several institutional custody providers. Contact us to discuss integration with your existing custody setup.',
  },
  {
    q: 'What reporting is available?',
    a: 'Standard reports include monthly performance summaries. Custom reporting with detailed analytics, transaction history, and tax documentation is available for institutional partners.',
  },
];

export default function InstitutionalPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-canopy-900/50 text-canopy-400 text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" />
              For Institutional Investors
            </span>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Enterprise Staking Solutions
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Professional infrastructure, transparent operations, and dedicated support for institutional delegators
            </p>
          </div>

          {/* Trust Signals */}
          <div className="card p-6 mb-12">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-canopy-400" />
                </div>
                <div className="text-2xl font-bold text-canopy-400">99.9%+</div>
                <div className="text-xs text-coreezy-400">Uptime Target</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Percent className="w-5 h-5 text-canopy-400" />
                </div>
                <div className="text-2xl font-bold text-canopy-400">2%</div>
                <div className="text-xs text-coreezy-400">Commission</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-canopy-400" />
                </div>
                <div className="text-2xl font-bold text-canopy-400">Wyoming</div>
                <div className="text-xs text-coreezy-400">LLC Structure</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-canopy-400" />
                </div>
                <div className="text-2xl font-bold text-canopy-400">Zeeve</div>
                <div className="text-xs text-coreezy-400">Infrastructure</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6">
              Why Institutional Investors Choose Coreezy
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="card p-6">
                  <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-3">
                    <feature.Icon className="w-6 h-6 text-canopy-400" />
                  </div>
                  <h3 className="font-bold text-coreezy-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-coreezy-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Two Column: FAQ + Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold text-canopy-400 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQ.map((item, i) => (
                  <div key={i} className="card p-4">
                    <h3 className="font-semibold text-coreezy-100 mb-2">{item.q}</h3>
                    <p className="text-sm text-coreezy-400">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Inquiry Form */}
            <section>
              <h2 className="text-2xl font-bold text-canopy-400 mb-6">
                Request Information
              </h2>
              <InstitutionalForm />
            </section>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-4 rounded-lg bg-coreezy-800/30 border border-coreezy-700">
            <p className="text-xs text-coreezy-500 text-center">
              This page is for informational purposes only and does not constitute investment advice.
              Cryptocurrency staking involves risk of loss. Please conduct your own due diligence.
            </p>
          </div>
        </div>
    </div>
  );
}
