'use client';

import { useState } from 'react';
import { useWallet } from '@/components/wallet/wallet-provider';

const PLATFORMS = [
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'article', label: 'Article/Blog' },
  { value: 'other', label: 'Other' },
];

export function BoostRequestForm() {
  const { isConnected, address } = useWallet();
  const [formData, setFormData] = useState({
    platform: '',
    proofUrl: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      setStatus('error');
      setErrorMessage('Please connect your wallet first');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/race/boost-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          platform: formData.platform,
          proofUrl: formData.proofUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      setStatus('success');
      setFormData({ platform: '', proofUrl: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (!isConnected) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h3 className="text-xl font-bold text-coreezy-100 mb-2">
          Connect Wallet
        </h3>
        <p className="text-coreezy-400">
          Please connect your wallet to submit a boost request.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-xl font-bold text-coreezy-100 mb-2">
          Request Submitted!
        </h3>
        <p className="text-coreezy-400 mb-6">
          We&apos;ll review your submission within 24-48 hours. If approved, the boost
          will be applied automatically.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-outline px-6 py-2"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="space-y-4">
        {/* Connected Wallet */}
        <div className="p-3 rounded-lg bg-coreezy-800/50">
          <div className="text-xs text-coreezy-500 mb-1">Connected Wallet</div>
          <div className="font-mono text-sm text-coreezy-300">{address}</div>
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-coreezy-300 mb-1">
            Platform *
          </label>
          <select
            id="platform"
            name="platform"
            required
            value={formData.platform}
            onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
            className="input"
          >
            <option value="">Select platform</option>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Proof URL */}
        <div>
          <label htmlFor="proofUrl" className="block text-sm font-medium text-coreezy-300 mb-1">
            Link to Post *
          </label>
          <input
            type="url"
            id="proofUrl"
            name="proofUrl"
            required
            value={formData.proofUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, proofUrl: e.target.value }))}
            className="input"
            placeholder="https://twitter.com/yourname/status/..."
          />
          <p className="mt-1 text-xs text-coreezy-500">
            Paste the direct URL to your post
          </p>
        </div>

        {status === 'error' && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full py-3"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}
