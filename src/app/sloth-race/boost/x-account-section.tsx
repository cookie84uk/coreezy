'use client';

import { useWallet } from '@/components/wallet/wallet-provider';
import { XAccountLink } from '@/components/race/x-account-link';
import { Twitter, Sparkles, ExternalLink } from 'lucide-react';

// Pre-written tweet templates
const TWEET_TEMPLATES = [
  {
    label: 'Validator Promo',
    text: `Just staked my $CORE with @CoreezyVibes validator! 🌿

Enterprise-grade infrastructure, transparent operations, and the Sloth Race is actually fun.

Slow and steady wins the race.

#Coreezy #Coreum #CORE`,
  },
  {
    label: 'Sloth Race',
    text: `The @CoreezyVibes Sloth Race is live! 🦥

Delegate to Coreezy → Get ranked → Compete for rewards

Top 33% = Adult Sloth
Middle 33% = Teen Sloth  
Bottom 33% = Baby Sloth

Who knew being slow could be so competitive?

#Coreezy #SlothRace #Coreum`,
  },
  {
    label: 'NFT Collection',
    text: `OG NFT holders on @CoreezyVibes are getting real utility 👀

- Automatic CORE rewards from validator earnings
- Cubs Collection coming soon
- Cross-chain expansion to XRPL

This is how NFTs should work.

#Coreezy #CoreumNFT #NFTUtility`,
  },
];

function generateTweetIntent(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function XAccountSection() {
  const { address, isConnected, raceProfile } = useWallet();

  if (!isConnected || !address) {
    return (
      <div className="card p-6 border-sky-700/30 bg-sky-950/20">
        <div className="text-center py-4">
          <Twitter className="w-10 h-10 text-sky-400 mx-auto mb-3 opacity-50" />
          <p className="text-coreezy-400">Connect your wallet to link your X account</p>
        </div>
      </div>
    );
  }

  // Check if user has linked X (stored in profile name as @handle)
  const linkedHandle = raceProfile?.name?.startsWith('@') ? raceProfile.name : null;

  return (
    <div className="space-y-6">
      {/* X Account Link */}
      <XAccountLink 
        address={address} 
        currentHandle={linkedHandle}
      />

      {/* Quick Tweet Templates */}
      <div className="card p-6 border-sky-700/30 bg-sky-950/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-sky-400">Quick Post to X</h2>
        </div>
        <p className="text-sm text-coreezy-400 mb-4">
          Click a template below to open X with a pre-written post. Customize it to make it your own!
        </p>
        <div className="grid gap-3">
          {TWEET_TEMPLATES.map((template, i) => (
            <a
              key={i}
              href={generateTweetIntent(template.text)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-coreezy-800/50 hover:bg-coreezy-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-sky-400" />
                <span className="font-medium text-coreezy-200">{template.label}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-coreezy-500 group-hover:text-sky-400 transition-colors" />
            </a>
          ))}
        </div>
        
        {linkedHandle ? (
          <p className="text-xs text-canopy-400 mt-3">
            ✓ Posts will be auto-tracked for your linked account
          </p>
        ) : (
          <p className="text-xs text-coreezy-500 mt-3">
            Link your X account above to enable auto-tracking, or submit posts manually below
          </p>
        )}
      </div>
    </div>
  );
}
