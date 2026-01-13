import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Coreezy',
  description: 'Privacy Policy for Coreezy website and services.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gradient mb-8">Privacy Policy</h1>
          
          <div className="card p-8 prose prose-invert prose-coreezy max-w-none">
            <p className="text-sm text-coreezy-400 mb-8">Last updated: January 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">1. Information We Collect</h2>
              <p className="text-coreezy-300 text-sm mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 text-coreezy-300 text-sm space-y-2">
                <li><strong>Wallet Addresses:</strong> When you connect your wallet, we store your public wallet address</li>
                <li><strong>Delegation Data:</strong> We track delegation amounts to our validator for Sloth Race scoring</li>
                <li><strong>Site Activity:</strong> We record site visits for scoring purposes</li>
                <li><strong>Form Submissions:</strong> Information you provide through contact and inquiry forms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">2. How We Use Information</h2>
              <ul className="list-disc pl-6 text-coreezy-300 text-sm space-y-2">
                <li>To provide Sloth Race scoring and leaderboards</li>
                <li>To respond to inquiries and support requests</li>
                <li>To improve our services and user experience</li>
                <li>To communicate important updates about our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">3. Blockchain Data</h2>
              <p className="text-coreezy-300 text-sm">
                Please note that blockchain transactions are public by nature. Your wallet address, delegation amounts,
                and transaction history are visible on the public Coreum blockchain and block explorers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">4. Data Sharing</h2>
              <p className="text-coreezy-300 text-sm">
                We do not sell your personal information. We may share data with service providers who help operate
                our services (hosting, analytics) under appropriate confidentiality agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">5. Cookies</h2>
              <p className="text-coreezy-300 text-sm">
                We use essential cookies to maintain session state and remember your wallet connection preferences.
                We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">6. Data Security</h2>
              <p className="text-coreezy-300 text-sm">
                We implement reasonable security measures to protect your information. However, no system is completely
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">7. Your Rights</h2>
              <p className="text-coreezy-300 text-sm">
                You may request access to, correction of, or deletion of your personal data by contacting us.
                Note that blockchain data cannot be deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-canopy-400 mb-4">8. Contact</h2>
              <p className="text-coreezy-300 text-sm">
                For privacy-related inquiries, please contact us through our official Telegram channel.
              </p>
            </section>
          </div>
        </div>
    </div>
  );
}
