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
import { NumberDisplay } from '@/components/ui/number-display';

interface LPToken {
  denom: string;
  balance: number;
}

interface WalletData {
  label: string;
  address: string;
  core: number;
  coreStaked: number;
  corez: number;
  lpTokens?: LPToken[];
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
  lpTokens?: LPToken[];
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
  recipients: number;
  txHash: string;
}

interface DistributionTotals {
  totalDistributed: string;
  distributionCount: number;
}

export function HoldingsDashboard() {
  const [holdings, setHoldings] = useState<HoldingsData | null>(null);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [distributionTotals, setDistributionTotals] = useState<DistributionTotals | null>(null);
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
        setDistributionTotals(data.totals || null);
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
      <div className="space-y-4 sm:space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 sm:p-6 animate-pulse">
            <div className="h-5 sm:h-6 bg-coreezy-700 rounded w-32 sm:w-48 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j}>
                  <div className="h-6 sm:h-8 bg-coreezy-700 rounded mb-2" />
                  <div className="h-3 sm:h-4 bg-coreezy-700 rounded w-16 sm:w-20" />
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
    <div className="space-y-6 sm:space-y-8">
      {/* Last Updated + Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-coreezy-400">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>
            Updated: {new Date(holdings.lastUpdated).toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="btn-ghost px-3 py-2 text-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-canopy-900/50">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-canopy-400" />
            </div>
            <span className="text-xs sm:text-sm text-coreezy-400">Total CORE</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-canopy-400">
            <NumberDisplay value={holdings.totals.core} decimals={0} />
          </div>
        </div>

        <div className="card p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-canopy-900/50">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-canopy-400" />
            </div>
            <span className="text-xs sm:text-sm text-coreezy-400">Staked</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-canopy-400">
            <NumberDisplay value={holdings.totals.coreStaked} decimals={0} />
          </div>
        </div>

        <div className="card p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-900/50">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <span className="text-xs sm:text-sm text-coreezy-400">COREZ</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-amber-400">
            <NumberDisplay value={holdings.totals.corez} decimals={0} />
          </div>
        </div>

        <div className="card p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-900/50">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <span className="text-xs sm:text-sm text-coreezy-400">Validator</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-400">
            <NumberDisplay value={holdings.totals.validatorTotalStaked} decimals={0} />
          </div>
        </div>
      </div>

      {/* COREZ Token Info */}
      {holdings.corezToken && (
        <div className="card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-coreezy-100 mb-3 sm:mb-4 flex items-center gap-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            COREZ Token Supply
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Total Supply</div>
              <div className="text-base sm:text-xl font-bold text-amber-400">
                <NumberDisplay value={holdings.corezToken.totalSupply} decimals={0} />
              </div>
            </div>
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Held by Project</div>
              <div className="text-base sm:text-xl font-bold text-coreezy-200">
                <NumberDisplay value={holdings.corezToken.heldByProject} decimals={0} />
              </div>
            </div>
            <div>
              <div className="text-xs text-coreezy-500 mb-1">Circulating</div>
              <div className="text-base sm:text-xl font-bold text-canopy-400">
                <NumberDisplay value={holdings.corezToken.circulatingSupply} decimals={0} />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <div className="text-xs text-coreezy-500 mb-1">Token Denom</div>
              <div className="text-xs sm:text-sm font-mono text-coreezy-400 truncate">
                {holdings.corezToken.detectedDenom}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Details */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Main Vault */}
        <WalletCard
          wallet={holdings.wallets.mainVault}
          onCopy={copyAddress}
          copied={copiedAddress === holdings.wallets.mainVault.address}
        />

        {/* Treasury with LP Tokens */}
        <TreasuryCard
          wallet={holdings.wallets.treasury}
          lpTokens={holdings.lpTokens}
          onCopy={copyAddress}
          copied={copiedAddress === holdings.wallets.treasury.address}
        />
      </div>

      {/* Distribution History */}
      <div className="card">
        <div className="p-3 sm:p-4 border-b border-coreezy-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-coreezy-100">
                OG NFT Distributions
              </h2>
              <p className="text-[10px] sm:text-xs text-coreezy-400 mt-0.5 sm:mt-1">
                On-chain history from airdrop wallet
              </p>
            </div>
            {distributionTotals && distributionTotals.distributionCount > 0 && (
              <div className="text-left sm:text-right bg-coreezy-800/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                <div className="text-[10px] sm:text-xs text-coreezy-400">Total Distributed</div>
                <div className="text-lg sm:text-xl font-bold text-canopy-400">{distributionTotals.totalDistributed} CORE</div>
                <div className="text-[10px] sm:text-xs text-coreezy-500">{distributionTotals.distributionCount} distributions</div>
              </div>
            )}
          </div>
        </div>

        {distributions.length === 0 ? (
          <div className="p-8 text-center text-coreezy-400">
            <p>No distribution history available yet.</p>
            <p className="text-sm mt-2">
              Distributions will appear here after they are recorded on-chain.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile view - cards */}
            <div className="sm:hidden divide-y divide-coreezy-800">
              {distributions.map((d, i) => (
                <div key={i} className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-coreezy-300 font-medium">
                      {new Date(d.date).toLocaleDateString()}
                    </span>
                    <a
                      href={`https://explorer.coreum.com/coreum/transactions/${d.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-canopy-400 hover:text-canopy-300 p-2 -m-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-coreezy-500">Total</span>
                    <span className="font-mono text-coreezy-200">{d.totalAmount} CORE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-coreezy-500">Per NFT</span>
                    <span className="font-mono text-canopy-400">{d.perNft} CORE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-coreezy-500">Recipients</span>
                    <span className="text-coreezy-300">{d.recipients}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-coreezy-400 border-b border-coreezy-700">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Per NFT</th>
                    <th className="px-4 py-3 text-right">Recipients</th>
                    <th className="px-4 py-3 text-right">TX</th>
                  </tr>
                </thead>
                <tbody>
                  {distributions.map((d, i) => (
                    <tr key={i} className="border-b border-coreezy-800 hover:bg-coreezy-800/30">
                      <td className="px-4 py-3 text-coreezy-300">
                        {new Date(d.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-coreezy-200">
                        {d.totalAmount} CORE
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-canopy-400">
                        {d.perNft} CORE
                      </td>
                      <td className="px-4 py-3 text-right text-coreezy-300">
                        {d.recipients}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`https://explorer.coreum.com/coreum/transactions/${d.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-canopy-400 hover:text-canopy-300 inline-block p-2 -m-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
    <div className="card p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-1.5 sm:p-2 rounded-lg bg-coreezy-800">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-coreezy-300" />
        </div>
        <h3 className="font-bold text-sm sm:text-base text-coreezy-100">{wallet.label}</h3>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1 sm:gap-2 p-2 rounded bg-coreezy-800/50 mb-3 sm:mb-4">
        <code className="text-[10px] sm:text-xs text-coreezy-400 flex-1 truncate">
          {wallet.address}
        </code>
        <button
          onClick={() => onCopy(wallet.address)}
          className="p-2 -m-1 hover:bg-coreezy-700 rounded transition-colors shrink-0"
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
          className="p-2 -m-1 hover:bg-coreezy-700 rounded transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-coreezy-400" />
        </a>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <div className="text-[10px] sm:text-xs text-coreezy-500 mb-1">COREZ</div>
          <div className="text-sm sm:text-lg font-bold text-amber-400">
            <NumberDisplay value={wallet.corez} decimals={0} />
          </div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs text-coreezy-500 mb-1">CORE</div>
          <div className="text-sm sm:text-lg font-bold text-coreezy-200">
            <NumberDisplay value={wallet.core} decimals={0} />
          </div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs text-coreezy-500 mb-1">Staked</div>
          <div className="text-sm sm:text-lg font-bold text-canopy-400">
            <NumberDisplay value={wallet.coreStaked} decimals={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TreasuryCard({
  wallet,
  lpTokens,
  onCopy,
  copied,
}: {
  wallet: WalletData;
  lpTokens?: LPToken[];
  onCopy: (address: string) => void;
  copied: boolean;
}) {
  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-1.5 sm:p-2 rounded-lg bg-coreezy-800">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-coreezy-300" />
        </div>
        <h3 className="font-bold text-sm sm:text-base text-coreezy-100">{wallet.label}</h3>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1 sm:gap-2 p-2 rounded bg-coreezy-800/50 mb-3 sm:mb-4">
        <code className="text-[10px] sm:text-xs text-coreezy-400 flex-1 truncate">
          {wallet.address}
        </code>
        <button
          onClick={() => onCopy(wallet.address)}
          className="p-2 -m-1 hover:bg-coreezy-700 rounded transition-colors shrink-0"
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
          className="p-2 -m-1 hover:bg-coreezy-700 rounded transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-coreezy-400" />
        </a>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <div className="text-[10px] sm:text-xs text-coreezy-500 mb-1">COREZ</div>
          <div className="text-sm sm:text-lg font-bold text-amber-400">
            <NumberDisplay value={wallet.corez} decimals={0} />
          </div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs text-coreezy-500 mb-1">CORE</div>
          <div className="text-sm sm:text-lg font-bold text-coreezy-200">
            <NumberDisplay value={wallet.core} decimals={0} />
          </div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs text-coreezy-500 mb-1">Staked</div>
          <div className="text-sm sm:text-lg font-bold text-canopy-400">
            <NumberDisplay value={wallet.coreStaked} decimals={0} />
          </div>
        </div>
      </div>

      {/* LP Tokens */}
      {lpTokens && lpTokens.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-coreezy-700">
          <h4 className="text-xs font-semibold text-coreezy-400 mb-2 sm:mb-3 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            LP Tokens
          </h4>
          <div className="space-y-2">
            {lpTokens.map((lp, i) => (
              <div key={i} className="flex justify-between items-center gap-2 p-2 rounded bg-coreezy-800/50">
                <code className="text-[10px] sm:text-xs text-coreezy-400 truncate flex-1">{lp.denom}</code>
                <span className="font-mono text-xs sm:text-sm text-canopy-400 shrink-0">
                  <NumberDisplay value={lp.balance / 1_000_000} decimals={2} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
