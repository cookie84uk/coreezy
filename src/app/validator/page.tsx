import { Metadata } from 'next';
import Link from 'next/link';
import { ValidatorStats } from '@/components/validator/validator-stats';
import {
  Server,
  Shield,
  Clock,
  Activity,
  Eye,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  FileText,
  Vote,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Validator Transparency | Coreezy',
  description:
    'Coreezy Vibes Validator - Enterprise-grade infrastructure on Coreum with full transparency.',
};

export default function ValidatorPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Coreezy Vibes Validator
            </h1>
            <p className="text-xl text-coreezy-300 max-w-2xl mx-auto">
              Enterprise-grade validation infrastructure with full transparency
            </p>
          </div>

          {/* Live Stats */}
          <ValidatorStats />

          {/* Scope of Operations */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Scope of Operations
            </h2>
            <div className="card p-6">
              <p className="text-coreezy-300">
                Coreezy Vibes LLC operates as a{' '}
                <strong className="text-coreezy-100">Coreum Mainnet validator</strong>,
                securing the network while distributing rewards to delegators. This
                page documents our infrastructure, policies, and performance for
                institutional due diligence.
              </p>
            </div>
          </section>

          {/* Infrastructure */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Server className="w-6 h-6" />
              Infrastructure
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-coreezy-100 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-canopy-400" />
                  Service Provider
                </h3>
                <p className="text-coreezy-300 mb-4">
                  Managed by <strong className="text-coreezy-100">Zeeve</strong>, a
                  professional blockchain infrastructure provider with enterprise SLAs.
                </p>
                <ul className="space-y-2 text-sm text-coreezy-400">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-canopy-500" />
                    24/7 infrastructure monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-canopy-500" />
                    Automated alerting and incident response
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-canopy-500" />
                    Professional node management
                  </li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-coreezy-100 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-canopy-400" />
                  Architecture
                </h3>
                <ul className="space-y-2 text-sm text-coreezy-400">
                  <li className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-canopy-500" />
                    Multi-region cloud deployment
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-canopy-500" />
                    Redundant sentry nodes for DDoS protection
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-canopy-500" />
                    HSM-grade key management
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-canopy-500" />
                    Automated failover capabilities
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Performance */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6" />
              Performance
            </h2>
            <div className="card p-6">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-canopy-400">99.9%+</div>
                  <div className="text-sm text-coreezy-400">Target Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-canopy-400">0</div>
                  <div className="text-sm text-coreezy-400">Slashing Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-canopy-400">Active</div>
                  <div className="text-sm text-coreezy-400">Validator Status</div>
                </div>
              </div>
              <p className="mt-6 text-sm text-coreezy-400 text-center">
                Performance data verifiable on{' '}
                <a
                  href="https://www.mintscan.io/coreum/validators/corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-canopy-400 hover:underline"
                >
                  Mintscan
                </a>{' '}
                and{' '}
                <a
                  href="https://explorer.coreum.com/coreum/validators/corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-canopy-400 hover:underline"
                >
                  Coreum Explorer
                </a>
              </p>
            </div>
          </section>

          {/* Economic Policy */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6" />
              Economic Policy
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-coreezy-100 mb-3">
                  Commission
                </h3>
                <div className="text-4xl font-bold text-canopy-400 mb-2">2%</div>
                <p className="text-sm text-coreezy-400">
                  Competitive rate with no hidden fees. Commission supports
                  infrastructure costs, community programs, and vault growth.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-coreezy-100 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-canopy-400" />
                  Slashing Protection
                </h3>
                <p className="text-coreezy-300 mb-3">
                  We maintain a dedicated reserve policy to protect delegator
                  capital in the unlikely event of slashing.
                </p>
                <ul className="space-y-1 text-sm text-coreezy-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-canopy-500" />
                    Proactive monitoring to prevent downtime
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-canopy-500" />
                    Documented incident response procedures
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-canopy-500" />
                    Capital protection mindset
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Transparency */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-canopy-400 mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6" />
              Transparency
            </h2>
            <div className="card p-6">
              <ul className="space-y-3 text-coreezy-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-canopy-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-coreezy-100">No hidden delegation logic</strong>{' '}
                    — what you see is what you get
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-canopy-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-coreezy-100">Public metrics</strong> — all
                    performance data verifiable on-chain
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Vote className="w-5 h-5 text-canopy-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-coreezy-100">Governance participation</strong>{' '}
                    — active voting with rationale shared publicly
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-canopy-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-coreezy-100">Community alignment</strong> —
                    validator rewards flow back to community programs
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Institutional CTA */}
          <section className="mt-16">
            <div className="card p-8 text-center bg-coreezy-800/50">
              <h2 className="text-2xl font-bold text-coreezy-100 mb-4 flex items-center justify-center gap-3">
                <Building2 className="w-6 h-6" />
                Institutional Inquiries
              </h2>
              <p className="text-coreezy-300 mb-6 max-w-xl mx-auto">
                For detailed documentation, due diligence materials, or partnership
                discussions, please reach out directly.
              </p>
              <Link href="/institutional" className="btn-primary px-6 py-3">
                Request Information
              </Link>
            </div>
          </section>
        </div>
    </div>
  );
}
