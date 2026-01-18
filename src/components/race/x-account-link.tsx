'use client';

import { useState } from 'react';
import { Twitter, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { generateVerificationIntent } from '@/lib/social-verification';

interface XAccountLinkProps {
  address: string;
  currentHandle?: string | null;
  onLinked?: (handle: string) => void;
}

type Step = 'input' | 'tweet' | 'verify' | 'success' | 'error';

export function XAccountLink({ address, currentHandle, onLinked }: XAccountLinkProps) {
  const [step, setStep] = useState<Step>(currentHandle ? 'success' : 'input');
  const [xHandle, setXHandle] = useState(currentHandle?.replace('@', '') || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificationUrl = generateVerificationIntent(address);

  const handleVerify = async () => {
    if (!xHandle.trim()) {
      setError('Please enter your X handle');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/social/verify-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          xHandle: xHandle.replace('@', ''),
          action: 'link',
        }),
      });

      const data = await response.json();

      if (data.verified) {
        setStep('success');
        onLinked?.(xHandle);
      } else if (data.manual) {
        // RapidAPI not configured - show manual instructions
        setError(data.message);
      } else {
        setError(data.message || 'Verification tweet not found');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckBoosts = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/social/verify-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          xHandle: xHandle.replace('@', ''),
          action: 'check-boost',
        }),
      });

      const data = await response.json();

      if (data.boostCreated) {
        // Show success toast or notification
        alert(`🎉 Boost activated! +${data.boost.multiplier}% for ${Math.round((new Date(data.boost.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to check for boosts');
    } finally {
      setIsVerifying(false);
    }
  };

  if (step === 'success' || currentHandle) {
    return (
      <div className="card p-4 border-sky-700/30 bg-sky-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-sky-900/50">
              <Twitter className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-coreezy-100">@{xHandle || currentHandle?.replace('@', '')}</span>
                <CheckCircle className="w-4 h-4 text-canopy-400" />
              </div>
              <span className="text-xs text-coreezy-500">X account linked</span>
            </div>
          </div>
          <button
            onClick={handleCheckBoosts}
            disabled={isVerifying}
            className="btn-primary px-3 py-1.5 text-sm flex items-center gap-2"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Twitter className="w-4 h-4" />
                Check for Boosts
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-amber-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="card p-4 border-sky-700/30 bg-sky-950/20">
      <div className="flex items-center gap-2 mb-4">
        <Twitter className="w-5 h-5 text-sky-400" />
        <h3 className="font-bold text-sky-400">Link X Account</h3>
      </div>

      <p className="text-sm text-coreezy-400 mb-4">
        Link your X account to automatically track your Coreezy posts and earn boosts!
      </p>

      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-coreezy-500 mb-1">Your X Handle</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coreezy-500">@</span>
                <input
                  type="text"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value.replace('@', ''))}
                  placeholder="username"
                  className="w-full bg-coreezy-800/50 border border-coreezy-700 rounded-lg pl-8 pr-3 py-2 text-coreezy-100 placeholder:text-coreezy-600 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setStep('tweet')}
                disabled={!xHandle.trim()}
                className="btn-primary px-4"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'tweet' && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-coreezy-800/50 text-sm">
            <p className="text-coreezy-300 mb-2">
              <strong>Step 1:</strong> Post this verification tweet:
            </p>
            <div className="p-2 rounded bg-coreezy-900/50 text-xs text-coreezy-400 font-mono">
              Verifying my @CoreezyVibes Sloth Race profile 🦥<br />
              Wallet: {address.slice(0, 12)}...{address.slice(-6)}<br />
              #CoreezyVerify
            </div>
          </div>

          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Twitter className="w-4 h-4" />
            Post Verification Tweet
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setStep('verify')}
            className="btn-ghost w-full text-sm"
          >
            I&apos;ve posted the tweet →
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <p className="text-sm text-coreezy-400">
            <strong>Step 2:</strong> Click verify to confirm your X account
          </p>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-800/50 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep('tweet')}
              className="btn-ghost flex-1"
            >
              ← Back
            </button>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify Account
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
