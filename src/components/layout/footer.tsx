import Link from 'next/link';
import { Twitter, Send } from 'lucide-react';

const footerLinks = {
  community: [
    { name: 'Sloth Race', href: '/sloth-race' },
    { name: 'Partner Projects', href: '/partners' },
    { name: 'NFT Collections', href: '/nfts' },
    { name: 'Telegram', href: 'https://t.me/+hh333N0pTRFjNjIx' },
  ],
  validator: [
    { name: 'Transparency', href: '/validator' },
    { name: 'Holdings Dashboard', href: '/holdings' },
    { name: 'Institutional', href: '/institutional' },
    { name: 'Mintscan', href: 'https://www.mintscan.io/coreum/validators/corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh' },
  ],
  resources: [
    { name: 'White Paper', href: '/white-paper' },
    { name: 'Tokenomics', href: '/tokenomics' },
    { name: 'Vault Dashboard', href: '/vault' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-coreezy-800 bg-coreezy-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🦥</span>
              <span className="text-xl font-bold text-gradient">Coreezy</span>
            </Link>
            <p className="mt-4 text-sm text-coreezy-400">
              Stake. Vibe. Grow. Repeat.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://x.com/CoreezyVibes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coreezy-400 hover:text-coreezy-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/+hh333N0pTRFjNjIx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coreezy-400 hover:text-coreezy-200 transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-coreezy-200">Community</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-coreezy-400 hover:text-coreezy-200 transition-colors"
                    {...(link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-coreezy-200">Validator</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.validator.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-coreezy-400 hover:text-coreezy-200 transition-colors"
                    {...(link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-coreezy-200">Resources</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-coreezy-400 hover:text-coreezy-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-coreezy-200">Legal</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-coreezy-400 hover:text-coreezy-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-coreezy-800">
          <p className="text-xs text-coreezy-500 text-center">
            *This information is for educational and entertainment purposes only
            and should not be considered financial advice. Cryptocurrency
            investments are highly volatile and carry a risk of total loss.
            Always do your own research before making any investment decisions.
          </p>
          <p className="mt-4 text-xs text-coreezy-500 text-center">
            © {new Date().getFullYear()} Coreezy Vibes LLC. All rights reserved.
            <br />
            Coreezy™, Coreezy Vibes™, and related marks are owned by Coreezy
            Vibes LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
