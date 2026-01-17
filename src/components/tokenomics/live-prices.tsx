'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';

interface PriceData {
  corez: {
    priceInCoreum: number;
    priceInUsd: number | null;
  };
  coreum: {
    priceInUsd: number;
  };
  lastUpdated: string;
}

export function LivePrices() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrices = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const response = await fetch('/api/prices');
      if (response.ok) {
        const data = await response.json();
        setPrices(data);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => fetchPrices(true), 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 bg-coreezy-700 rounded w-24 mb-2" />
            <div className="h-8 bg-coreezy-700 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-coreezy-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Live Prices
        </h3>
        <button
          onClick={() => fetchPrices(true)}
          disabled={refreshing}
          className="text-xs text-coreezy-500 hover:text-coreezy-300 flex items-center gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {/* COREZ Price */}
        <div className="card p-4 border-canopy-700/30">
          <div className="text-xs text-coreezy-500 mb-1">COREZ Price</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-canopy-400">
              {prices?.corez.priceInCoreum.toFixed(4) || '—'}
            </span>
            <span className="text-sm text-coreezy-400">COREUM</span>
          </div>
          {prices?.corez.priceInUsd && (
            <div className="text-xs text-coreezy-500 mt-1">
              ≈ ${prices.corez.priceInUsd.toFixed(6)} USD
            </div>
          )}
        </div>

        {/* COREUM Price */}
        <div className="card p-4 border-canopy-700/30">
          <div className="text-xs text-coreezy-500 mb-1">COREUM Price</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-canopy-400">
              ${prices?.coreum.priceInUsd.toFixed(4) || '—'}
            </span>
            <span className="text-sm text-coreezy-400">USD</span>
          </div>
          <div className="text-xs text-coreezy-500 mt-1">
            via CoinGecko
          </div>
        </div>
      </div>

      {prices?.lastUpdated && (
        <div className="text-xs text-coreezy-600 mt-2 text-right">
          Updated: {new Date(prices.lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
