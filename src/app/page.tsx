import Link from 'next/link';
import Image from 'next/image';
import {
  Server,
  Shield,
  AlertTriangle,
  BarChart3,
  Eye,
  Users,
} from 'lucide-react';

const TRUST_ITEMS = [
  {
    Icon: Server,
    title: 'Enterprise Infrastructure',
    description:
      'Powered by Zeeve with multi-region cloud deployment for maximum resilience.',
  },
  {
    Icon: Shield,
    title: 'Slashing Reserve',
    description:
      'Dedicated reserve policy to protect delegator capital in adverse events.',
  },
  {
    Icon: AlertTriangle,
    title: 'Incident Response',
    description:
      'Documented procedures for rapid response and transparent communication.',
  },
  {
    Icon: BarChart3,
    title: 'Public Metrics',
    description:
      'All performance data verifiable on-chain via Mintscan and Coreum Explorer.',
  },
  {
    Icon: Eye,
    title: 'Transparent Delegation',
    description:
      'No hidden delegation logic. What you see is what you get.',
  },
  {
    Icon: Users,
    title: 'Community Aligned',
    description:
      'Validator rewards flow back to community programs and vault growth.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-jungle">
      {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Logo - show first on mobile */}
              <div className="relative flex items-center justify-center lg:order-2">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                  <div className="absolute inset-0 bg-gradient-radial from-canopy-500/30 to-transparent rounded-full animate-slow-pulse" />
                  <Image
                    src="/logo.png"
                    alt="Coreezy"
                    width={400}
                    height={400}
                    className="relative w-full h-full object-contain animate-float drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              <div className="max-w-xl lg:max-w-none text-center lg:text-left lg:order-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                  <span className="text-gradient">Enterprise Validation</span>
                  <br />
                  Built on Coreum
                </h1>

                <p className="mt-4 text-lg sm:text-xl font-medium text-canopy-400">
                  Secure. Transparent. Community-Aligned.
                </p>

                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-coreezy-300">
                  Coreezy operates enterprise-grade validator infrastructure on the Coreum 
                  blockchain, combining institutional-level security with community-focused 
                  reward distribution.
                </p>

                <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-coreezy-300 text-left">
                  <li className="flex items-start">
                    <span className="mr-2 text-canopy-400">•</span>
                    99.9% uptime with Zeeve infrastructure
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-canopy-400">•</span>
                    Wyoming LLC with documented governance
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-canopy-400">•</span>
                    Transparent on-chain operations
                  </li>
                </ul>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    href="/validator"
                    className="btn-primary px-6 py-3 text-base sm:text-lg w-full sm:w-auto"
                  >
                    Stake with Coreezy
                  </Link>
                  <Link
                    href="/institutional"
                    className="btn-secondary px-6 py-3 text-base sm:text-lg w-full sm:w-auto"
                  >
                    Institutional Inquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals Strip */}
        <section className="border-y border-coreezy-800 bg-coreezy-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-8 text-center">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-canopy-400">99.9%</div>
                <div className="text-xs sm:text-sm text-coreezy-400">Uptime</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-canopy-400">2%</div>
                <div className="text-xs sm:text-sm text-coreezy-400">Commission</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-canopy-400">Zeeve</div>
                <div className="text-xs sm:text-sm text-coreezy-400">Infrastructure</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl sm:text-3xl font-bold text-canopy-400">24/7</div>
                <div className="text-xs sm:text-sm text-coreezy-400">Monitoring</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl sm:text-3xl font-bold text-canopy-400">Wyoming</div>
                <div className="text-xs sm:text-sm text-coreezy-400">LLC</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Audience Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Community Card */}
              <div className="card-hover p-8">
                <h3 className="text-2xl font-bold text-canopy-400 mb-4">
                  For Community
                </h3>
                <p className="text-coreezy-300 mb-6">
                  Built for long-term Coreum supporters who believe in patience
                  and steady growth.
                </p>
                <ul className="space-y-3 text-coreezy-300 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-canopy-500 rounded-full mr-3" />
                    Fair rewards distribution
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-canopy-500 rounded-full mr-3" />
                    Transparent operations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-canopy-500 rounded-full mr-3" />
                    Partner project support
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-canopy-500 rounded-full mr-3" />
                    NFT access & perks
                  </li>
                </ul>
                <Link href="/sloth-race" className="btn-primary px-5 py-2">
                  Join the Sloth Race
                </Link>
              </div>

              {/* Institutional Card */}
              <div className="card-hover p-8">
                <h3 className="text-2xl font-bold text-coreezy-200 mb-4">
                  For Institutions
                </h3>
                <p className="text-coreezy-300 mb-6">
                  Enterprise-grade validation infrastructure with professional
                  operations and governance.
                </p>
                <ul className="space-y-3 text-coreezy-300 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-coreezy-400 rounded-full mr-3" />
                    Jurisdiction-aware operations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-coreezy-400 rounded-full mr-3" />
                    Redundancy & failover
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-coreezy-400 rounded-full mr-3" />
                    Capital protection mindset
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-coreezy-400 rounded-full mr-3" />
                    Documented governance
                  </li>
                </ul>
                <Link href="/institutional" className="btn-secondary px-5 py-2">
                  Institutional Overview
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Trust Section */}
        <section className="py-20 bg-coreezy-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Trust Coreezy?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRUST_ITEMS.map((item, i) => (
                <div key={i} className="glass rounded-xl p-6">
                  <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-3">
                    <item.Icon className="w-5 h-5 text-canopy-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-canopy-400 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-coreezy-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </div>
  );
}
