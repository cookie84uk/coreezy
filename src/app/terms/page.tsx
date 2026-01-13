import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Coreezy',
  description: 'Terms of Service for Coreezy website and services.',
};

export default function TermsPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gradient mb-8">Terms of Service</h1>
          
          <div className="card p-8 prose prose-invert prose-coreezy max-w-none">
            <p className="text-sm text-coreezy-400 mb-8">Last updated: January 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">1. Acceptance of Terms</h2>
              <p className="text-coreezy-300 text-sm">
                By accessing or using the Coreezy website and services, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">2. Services Description</h2>
              <p className="text-coreezy-300 text-sm">
                Coreezy provides information about blockchain validation services, cryptocurrency staking, and related
                community activities on the Coreum blockchain. Our services include validator operations, token information,
                and community engagement features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">3. No Financial Advice</h2>
              <p className="text-coreezy-300 text-sm">
                Nothing on this website constitutes financial, investment, legal, or tax advice. All information is
                provided for educational and entertainment purposes only. You should conduct your own research and
                consult with qualified professionals before making any investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">4. Risk Disclosure</h2>
              <p className="text-coreezy-300 text-sm">
                Cryptocurrency investments are highly volatile and carry significant risk, including the risk of total
                loss. Staking involves locking tokens for periods during which market conditions may change. Validator
                operations carry risks including slashing. Past performance does not guarantee future results.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">5. User Responsibilities</h2>
              <p className="text-coreezy-300 text-sm mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-coreezy-300 text-sm space-y-2">
                <li>Use our services in compliance with all applicable laws</li>
                <li>Not engage in fraudulent or deceptive activities</li>
                <li>Safeguard your own wallet credentials and private keys</li>
                <li>Not attempt to manipulate or abuse our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">6. Intellectual Property</h2>
              <p className="text-coreezy-300 text-sm">
                All content, trademarks, and intellectual property on this website are owned by Coreezy Vibes LLC.
                You may not reproduce, distribute, or create derivative works without prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">7. Limitation of Liability</h2>
              <p className="text-coreezy-300 text-sm">
                To the maximum extent permitted by law, Coreezy Vibes LLC shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">8. Changes to Terms</h2>
              <p className="text-coreezy-300 text-sm">
                We reserve the right to modify these terms at any time. Continued use of our services after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-canopy-400 mb-4">9. Contact</h2>
              <p className="text-coreezy-300 text-sm">
                For questions about these terms, please contact us through our official Telegram channel.
              </p>
            </section>
          </div>
        </div>
    </div>
  );
}
