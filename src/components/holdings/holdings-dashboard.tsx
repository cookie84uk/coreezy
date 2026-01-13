'use client';

import { useEffect, useState } from 'react';
import {
  Wallet,
  Coins,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Clock,
  Copy,
  Check,
} from 'lucide-react';

interface WalletData {
  label: string;
  address: string;
  core: number;
  coreStaked: number;
  corez: number;
}

interface HoldingsData {
  lastUpdated: string;
  wallets: {
    mainVault: WalletData;
    treasury: WalletData;
  };
  totals: {
    core: number;
    coreStaked: number;
    corez: number;
    validatorTotalStaked: number;
  };
  corezToken?: {
    totalSupply: number;
    decimals: number;
    detectedDenom: string;
    heldByProject: number;
    circulatingSupply: number;
  };
  validator: {
    address: string;
    totalStaked: number;
    status: string;
  };
}

interface Distribution {
  date: string;
  totalAmount: string;
  perNft: string;
  reStaked: string;
  toTreasury: string;
  txHash: string | null;
}

export function HoldingsDashboard() {
  const [holdings, setHoldings] = useState<HoldingsData | null>(null);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [holdingsRes, distributionsRes] = await Promise.all([
        fetch('/api/holdings'),
        fetch('/api/holdings/distributions'),
      ]);

      if (holdingsRes.ok) {
        const data = await holdingsRes.json();
        setHoldings(data);
      }

      if (distributionsRes.ok) {
        const data = await distributionsRes.json();
        setDistributions(data.distributions || []);
      }
    } catch (error) {
      console.error('Failed to fetch holdings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-6 bg-coreezy-700 rounded w-48 mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j}>
                  <div className="h-8 bg-coreezy-700 rounded mb-2" />
                  <div className="h-4 bg-coreezy-700 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!holdings) {
    return (
      <div className="card p-8 text-center">
        <p className="text-coreezy-400">Failed to load holdings data</p>
        <button onClick={() => fetchData()} className="btn-primary mt-4 px-4 py-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Last Updated + Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-coreezy-400">
          <Clock className="w-4 h-4" />
          <span>
            Last updated: {new Date(holdings.lastUpdated).toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="btn-ghost px-3 py-1.5 text-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-canopy-900/50">
              <Coins className="w-5 h-5 text-canopy-400" />
            </div>
            <span className="text-sm text-coreezy-400">Total CORE</span>
          </div>
          <div className="text-2xl font-bold text-canopy-400">
            {holdings.totals.core.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-canopy-900/50">
              <TrendingUp className="w-5 h-5 text-canopy-400" />
            </div>
            <span className="text-sm text-coreezy-400">Total Staked</span>
          </div>
          <div className="text-2xl font-bold text-canopy-400">
            {holdings.totals.coreStaked.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-900/50">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm text-coreezy-400">Total COREZ</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {holdings.totals.corez.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-900/50">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-coreezy-400">Validator Total</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {holdings.totals.validatorTotalStaked.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* COREZ Token Info */}
      {holdings.corezToken && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-coreezy-100 mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            COREZ Token Supply
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Total Supply</div>
              <div className="text-xl font-bold text-amber-400">
                {holdings.corezToken.totalSupply.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Held by Project</div>
              <div className="text-xl font-bold text-coreezy-200">
                {holdings.corezToken.heldByProject.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Circulating Supply</div>
              <div className="text-xl font-bold text-canopy-400">
                {holdings.corezToken.circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Token Denom</div>
              <div className="text-sm font-mono text-coreezy-400 truncate">
                {holdings.corezToken.detectedDenom}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Vault */}
        <WalletCard
          wallet={holdings.wallets.mainVault}
          onCopy={copyAddress}
          copied={copiedAddress === holdings.wallets.mainVault.address}
        />

        {/* Treasury */}
        <WalletCard
          wallet={holdings.wallets.treasury}
          onCopy={copyAddress}
          copied={copiedAddress === holdings.wallets.treasury.address}
        />
      </div>

      {/* Distribution History */}
      <div className="card">
        <div className="p-4 border-b border-coreezy-700">
          <h2 className="text-lg font-bold text-coreezy-100">
            OG NFT Reward Distributions
          </h2>
        </div>

        {distributions.length === 0 ? (
          <div className="p-8 text-center text-coreezy-400">
            <p>No distribution history available yet.</p>
            <p className="text-sm mt-2">
              Distributions will appear here after they are recorded on-chain.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-coreezy-400 border-b border-coreezy-700">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Per NFT</th>
                  <th className="px-4 py-3 text-right">Re-Staked</th>
                  <th className="px-4 py-3 text-right">To Treasury</th>
                  <th className="px-4 py-3 text-right">TX</th>
                </tr>
              </thead>
              <tbody>
                {distributions.map((d, i) => (
                  <tr key={i} className="border-b border-coreezy-800">
                    <td className="px-4 py-3 text-coreezy-300">
                      {new Date(d.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-canopy-400">
                      {d.perNft} CORE
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-coreezy-300">
                      {d.reStaked} CORE
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-coreezy-300">
                      {d.toTreasury} CORE
                    </td>
                    <td className="px-4 py-3 text-right">
                      {d.txHash ? (
                        <a
                          href={`https://explorer.coreum.com/coreum/transactions/${d.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-canopy-400 hover:text-canopy-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-coreezy-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletCard({
  wallet,
  onCopy,
  copied,
}: {
  wallet: WalletData;
  onCopy: (address: string) => void;
  copied: boolean;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-coreezy-800">
          <Wallet className="w-5 h-5 text-coreezy-300" />
        </div>
        <h3 className="font-bold text-coreezy-100">{wallet.label}</h3>
      </div>

      {/* Address */}
      <div className="flex items-center gap-2 p-2 rounded bg-coreezy-800/50 mb-4">
        <code className="text-xs text-coreezy-400 flex-1 truncate">
          {wallet.address}
        </code>
        <button
          onClick={() => onCopy(wallet.address)}
          className="p-1 hover:bg-coreezy-700 rounded transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-canopy-400" />
          ) : (
            <Copy className="w-4 h-4 text-coreezy-400" />
          )}
        </button>
        <a
          href={`https://explorer.coreum.com/coreum/accounts/${wallet.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 hover:bg-coreezy-700 rounded transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-coreezy-400" />
        </a>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-coreezy-500 mb-1">COREZ</div>
          <div className="text-lg font-bold text-amber-400">
            {wallet.corez.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </div>
        </div>
        <div>
          <div className="text-xs text-coreezy-500 mb-1">CORE</div>
          <div className="text-lg font-bold text-coreezy-200">
            {wallet.core.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-coreezy-500 mb-1">Staked</div>
          <div className="text-lg font-bold text-canopy-400">
            {wallet.coreStaked.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
