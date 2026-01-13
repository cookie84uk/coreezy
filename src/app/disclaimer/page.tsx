import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Coreezy',
  description: 'Risk disclaimer for Coreezy website and services.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gradient mb-8">Disclaimer</h1>
          
          <div className="card p-8 prose prose-invert prose-coreezy max-w-none">
            <div className="p-4 rounded-lg bg-amber-900/30 border border-amber-700/50 mb-8">
              <p className="text-amber-300 text-sm font-semibold">
                ⚠️ IMPORTANT: Please read this disclaimer carefully before using our services.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">Not Financial Advice</h2>
              <p className="text-coreezy-300 text-sm">
                All information provided on this website is for educational and entertainment purposes only.
                Nothing contained herein constitutes an offer, solicitation, or recommendation to buy, sell,
                or hold any cryptocurrency, token, or investment product.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">Investment Risks</h2>
              <p className="text-coreezy-300 text-sm mb-4">
                Cryptocurrency investments are speculative and carry significant risks:
              </p>
              <ul className="list-disc pl-6 text-coreezy-300 text-sm space-y-2">
                <li>Prices are highly volatile and can lose value rapidly</li>
                <li>You may lose some or all of your investment</li>
                <li>Past performance does not guarantee future results</li>
                <li>Regulatory changes may adversely affect cryptocurrencies</li>
                <li>Technical failures, hacks, or exploits can result in loss</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">Staking Risks</h2>
              <p className="text-coreezy-300 text-sm mb-4">
                Staking with any validator carries specific risks:
              </p>
              <ul className="list-disc pl-6 text-coreezy-300 text-sm space-y-2">
                <li><strong>Slashing:</strong> Validators may be penalized for downtime or misbehavior, resulting in loss of staked tokens</li>
                <li><strong>Unbonding Period:</strong> Unstaking requires a waiting period during which market conditions may change</li>
                <li><strong>Opportunity Cost:</strong> Staked tokens cannot be used for other purposes</li>
                <li><strong>Smart Contract Risk:</strong> Bugs in smart contracts may result in loss</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">Token Value</h2>
              <p className="text-coreezy-300 text-sm">
                The COREZ token&apos;s vault backing ratio provides a measure of fundamental value but does not guarantee
                market price. Market price is determined by supply and demand and may be above or below the backing ratio.
                The backing ratio itself may change based on vault operations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">No Guarantees</h2>
              <p className="text-coreezy-300 text-sm">
                We make no guarantees regarding uptime, returns, rewards, or the continued operation of any service.
                All services are provided &quot;as is&quot; without warranty of any kind.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-canopy-400 mb-4">Do Your Own Research</h2>
              <p className="text-coreezy-300 text-sm">
                Before making any investment decision, you should:
              </p>
              <ul className="list-disc pl-6 text-coreezy-300 text-sm space-y-2 mt-4">
                <li>Conduct your own thorough research</li>
                <li>Consult with qualified financial, legal, and tax advisors</li>
                <li>Only invest what you can afford to lose</li>
                <li>Understand the technology and risks involved</li>
                <li>Verify all information independently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-canopy-400 mb-4">Jurisdiction</h2>
              <p className="text-coreezy-300 text-sm">
                Our services may not be available or appropriate in all jurisdictions. It is your responsibility
                to ensure that your use of our services complies with the laws of your jurisdiction.
              </p>
            </section>
          </div>
        </div>
    </div>
  );
}
