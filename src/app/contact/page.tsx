import { Metadata } from 'next';
import Link from 'next/link';
import {
  MessageCircle,
  Twitter,
  Building2,
  Handshake,
  AlertTriangle,
  Shield,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Coreezy',
  description: 'Get in touch with the Coreezy team.',
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gradient mb-8 text-center">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Community Support */}
            <div className="card p-6">
              <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-4">
                <MessageCircle className="w-6 h-6 text-canopy-400" />
              </div>
              <h2 className="text-xl font-bold text-coreezy-100 mb-2">Community Support</h2>
              <p className="text-coreezy-400 text-sm mb-4">
                For general questions, join our Telegram community where team members and
                community helpers are available to assist.
              </p>
              <a
                href="https://t.me/+hh333N0pTRFjNjIx"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-2 justify-center"
              >
                Join Telegram
              </a>
            </div>

            {/* Social Media */}
            <div className="card p-6">
              <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-4">
                <Twitter className="w-6 h-6 text-canopy-400" />
              </div>
              <h2 className="text-xl font-bold text-coreezy-100 mb-2">Social Media</h2>
              <p className="text-coreezy-400 text-sm mb-4">
                Follow us on X for announcements, updates, and community highlights.
              </p>
              <a
                href="https://x.com/CoreezyVibes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-2 justify-center"
              >
                Follow @CoreezyVibes
              </a>
            </div>

            {/* Institutional */}
            <div className="card p-6">
              <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-4">
                <Building2 className="w-6 h-6 text-canopy-400" />
              </div>
              <h2 className="text-xl font-bold text-coreezy-100 mb-2">Institutional Inquiries</h2>
              <p className="text-coreezy-400 text-sm mb-4">
                For institutional staking, partnerships, or enterprise inquiries.
              </p>
              <Link href="/institutional" className="btn-outline w-full py-2 justify-center">
                Institutional Page
              </Link>
            </div>

            {/* Partnership */}
            <div className="card p-6">
              <div className="p-2 rounded-lg bg-coreezy-800 w-fit mb-4">
                <Handshake className="w-6 h-6 text-canopy-400" />
              </div>
              <h2 className="text-xl font-bold text-coreezy-100 mb-2">Partnerships</h2>
              <p className="text-coreezy-400 text-sm mb-4">
                Interested in partnering with Coreezy? Reach out through Telegram.
              </p>
              <Link href="/partners" className="btn-outline w-full py-2 justify-center">
                Learn About Partnerships
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 card p-6 border-amber-700/30">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-900/30 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-400 mb-3">
                  Security Notice
                </h2>
                <ul className="space-y-2 text-sm text-coreezy-300">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Coreezy team will <strong>NEVER</strong> DM you first
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    We will <strong>NEVER</strong> ask for your seed phrase or private keys
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Always verify announcements in official channels
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Report scams to community moderators
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Entity Info */}
          <div className="mt-8 text-center text-sm text-coreezy-500">
            <p>Coreezy Vibes LLC</p>
            <p>Wyoming, USA</p>
          </div>
        </div>
    </div>
  );
}
