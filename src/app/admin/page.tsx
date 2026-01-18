'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Users, Trophy, Zap, Clock, Gift, 
  RefreshCw, Play, AlertTriangle, CheckCircle,
  DollarSign, Settings, Activity, Database
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalUsers: number;
    totalProfiles: number;
    pendingBoostRequests: number;
    seasonActive: boolean;
    daysRemaining: number;
    season: { name: string };
  };
  classes: {
    ADULT: number;
    TEEN: number;
    BABY: number;
  };
  prizePool: {
    accumulated: number;
    bonus: number;
    lastUpdated: string | null;
    distribution: { adult: number; teen: number; baby: number };
    commissionPercent: number;
  };
  validator: {
    moniker: string;
    tokens: string;
    commissionRate: string;
    pendingCommission: string;
    jailed: boolean;
    status: string;
  } | null;
  snapshots: {
    recentDates: string[];
    lastRun: string | null;
  };
  recentJobs: Array<{
    id: string;
    name: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    error: string | null;
  }>;
  config: {
    seasonStartDate: string;
    seasonEndDate: string;
    prizeDistribution: { adult: number; teen: number; baby: number };
    commissionToPool: number;
  };
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<string | null>(null);

  // Form states
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusSource, setBonusSource] = useState('');
  const [claimedCommission, setClaimedCommission] = useState('');

  const fetchDashboard = useCallback(async () => {
    if (!secret) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      
      if (response.status === 401) {
        setAuthenticated(false);
        setError('Invalid admin secret');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setData(result);
      setAuthenticated(true);
    } catch {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    // Check for stored secret
    const stored = localStorage.getItem('admin_secret');
    if (stored) {
      setSecret(stored);
    }
  }, []);

  useEffect(() => {
    if (secret && !authenticated) {
      fetchDashboard();
    }
  }, [secret, authenticated, fetchDashboard]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_secret', secret);
    fetchDashboard();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_secret');
    setSecret('');
    setAuthenticated(false);
    setData(null);
  };

  const runAction = async (endpoint: string, body: object, actionName: string) => {
    setActionLoading(actionName);
    setActionResult(null);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setActionResult(`✓ ${actionName} completed`);
        fetchDashboard(); // Refresh data
      } else {
        setActionResult(`✗ ${result.error || 'Action failed'}`);
      }
    } catch {
      setActionResult(`✗ Failed to execute ${actionName}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-jungle py-12">
        <div className="mx-auto max-w-md px-4">
          <div className="card p-8">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-canopy-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-coreezy-100">Admin Access</h1>
              <p className="text-coreezy-400 text-sm mt-2">Enter your admin secret to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Admin Secret"
                className="w-full bg-coreezy-800/50 border border-coreezy-700 rounded-lg px-4 py-3 text-coreezy-100 placeholder:text-coreezy-600 focus:outline-none focus:border-canopy-500"
              />
              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !secret}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-jungle py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-canopy-400" />
            <div>
              <h1 className="text-2xl font-bold text-coreezy-100">Admin Dashboard</h1>
              <p className="text-sm text-coreezy-400">Coreezy Race Management</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="btn-ghost px-4 py-2 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={handleLogout} className="btn-ghost px-4 py-2 text-red-400">
              Logout
            </button>
          </div>
        </div>

        {/* Action Result Toast */}
        {actionResult && (
          <div className={`mb-4 p-3 rounded-lg ${
            actionResult.startsWith('✓') 
              ? 'bg-canopy-900/50 border border-canopy-600 text-canopy-300' 
              : 'bg-red-900/50 border border-red-600 text-red-300'
          }`}>
            {actionResult}
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Total Users"
                value={data.overview.totalUsers}
              />
              <StatCard
                icon={<Trophy className="w-5 h-5" />}
                label="Race Participants"
                value={data.overview.totalProfiles}
              />
              <StatCard
                icon={<Zap className="w-5 h-5" />}
                label="Pending Boosts"
                value={data.overview.pendingBoostRequests}
                highlight={data.overview.pendingBoostRequests > 0}
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Days Remaining"
                value={data.overview.daysRemaining}
              />
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Prize Pool Management */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-coreezy-100 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-canopy-400" />
                  Prize Pool Management
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-coreezy-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-canopy-400">
                      {(data.prizePool.accumulated + data.prizePool.bonus).toFixed(2)}
                    </div>
                    <div className="text-xs text-coreezy-400">Total Pool (CORE)</div>
                  </div>
                  <div className="bg-coreezy-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-amber-400">
                      {data.prizePool.bonus.toFixed(2)}
                    </div>
                    <div className="text-xs text-coreezy-400">Bonus Pool (CORE)</div>
                  </div>
                </div>

                {/* Add Bonus */}
                <div className="space-y-3 mb-4">
                  <label className="text-sm text-coreezy-300">Add Bonus Incentive</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(e.target.value)}
                      placeholder="Amount (CORE)"
                      className="flex-1 bg-coreezy-800/50 border border-coreezy-700 rounded px-3 py-2 text-sm text-coreezy-100"
                    />
                    <input
                      type="text"
                      value={bonusSource}
                      onChange={(e) => setBonusSource(e.target.value)}
                      placeholder="Source (optional)"
                      className="flex-1 bg-coreezy-800/50 border border-coreezy-700 rounded px-3 py-2 text-sm text-coreezy-100"
                    />
                  </div>
                  <button
                    onClick={() => runAction('/api/race/prize-pool', { 
                      addBonus: parseFloat(bonusAmount), 
                      bonusSource 
                    }, 'Add Bonus')}
                    disabled={actionLoading === 'Add Bonus' || !bonusAmount}
                    className="btn-primary px-4 py-2 text-sm w-full disabled:opacity-50"
                  >
                    {actionLoading === 'Add Bonus' ? 'Adding...' : 'Add Bonus to Pool'}
                  </button>
                </div>

                {/* Record Commission Claim */}
                <div className="space-y-3 pt-4 border-t border-coreezy-700">
                  <label className="text-sm text-coreezy-300">Record Commission Claim</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={claimedCommission}
                      onChange={(e) => setClaimedCommission(e.target.value)}
                      placeholder="Claimed Amount (CORE)"
                      className="flex-1 bg-coreezy-800/50 border border-coreezy-700 rounded px-3 py-2 text-sm text-coreezy-100"
                    />
                    <button
                      onClick={() => runAction('/api/race/prize-pool', { 
                        claimedAmount: parseFloat(claimedCommission)
                      }, 'Record Claim')}
                      disabled={actionLoading === 'Record Claim' || !claimedCommission}
                      className="btn-outline px-4 py-2 text-sm disabled:opacity-50"
                    >
                      {actionLoading === 'Record Claim' ? '...' : `Add ${data.prizePool.commissionPercent}%`}
                    </button>
                  </div>
                  <p className="text-xs text-coreezy-500">
                    When you claim validator commission, enter the amount here to add {data.prizePool.commissionPercent}% to the prize pool.
                  </p>
                </div>
              </div>

              {/* Validator Info */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-coreezy-100 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-canopy-400" />
                  Validator Status
                </h2>
                
                {data.validator ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-coreezy-400">Name</span>
                      <span className="text-coreezy-100 font-medium">{data.validator.moniker}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-coreezy-400">Total Staked</span>
                      <span className="text-coreezy-100 font-mono">{parseInt(data.validator.tokens).toLocaleString()} CORE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-coreezy-400">Commission Rate</span>
                      <span className="text-coreezy-100">{data.validator.commissionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-coreezy-400">Pending Commission</span>
                      <span className="text-canopy-400 font-bold">{data.validator.pendingCommission} CORE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-coreezy-400">Status</span>
                      <span className={`flex items-center gap-1 ${
                        data.validator.jailed ? 'text-red-400' : 'text-canopy-400'
                      }`}>
                        {data.validator.jailed ? (
                          <><AlertTriangle className="w-4 h-4" /> Jailed</>
                        ) : (
                          <><CheckCircle className="w-4 h-4" /> Active</>
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-coreezy-400">Failed to fetch validator info</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-coreezy-100 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-canopy-400" />
                  Quick Actions
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => runAction('/api/admin/snapshot', {}, 'Run Snapshot')}
                    disabled={actionLoading === 'Run Snapshot'}
                    className="btn-primary px-4 py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    {actionLoading === 'Run Snapshot' ? 'Running...' : 'Run Snapshot'}
                  </button>
                  
                  <button
                    onClick={() => runAction('/api/admin/snapshot?recalculate_classes=true', {}, 'Recalc Classes')}
                    disabled={actionLoading === 'Recalc Classes'}
                    className="btn-outline px-4 py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {actionLoading === 'Recalc Classes' ? 'Running...' : 'Recalc Classes'}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Reset all restake streaks to 0?')) {
                        runAction('/api/admin/reset-race', { resetStreaks: true }, 'Reset Streaks');
                      }
                    }}
                    disabled={actionLoading === 'Reset Streaks'}
                    className="btn-ghost px-4 py-3 text-sm text-amber-400 border border-amber-700"
                  >
                    Reset Streaks
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Reset prize pool for new season?')) {
                        runAction('/api/race/prize-pool', { resetPool: true }, 'Reset Pool');
                      }
                    }}
                    disabled={actionLoading === 'Reset Pool'}
                    className="btn-ghost px-4 py-3 text-sm text-red-400 border border-red-700"
                  >
                    Reset Pool
                  </button>
                </div>

                {/* Last Snapshot */}
                <div className="mt-4 pt-4 border-t border-coreezy-700">
                  <p className="text-xs text-coreezy-500">
                    Recent snapshots: {data.snapshots.recentDates.slice(0, 3).join(', ') || 'None'}
                  </p>
                </div>
              </div>

              {/* Class Distribution */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-coreezy-100 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-canopy-400" />
                  Class Distribution
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-canopy-400">Adult</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-coreezy-800 rounded-full h-2">
                        <div 
                          className="bg-canopy-500 h-2 rounded-full" 
                          style={{ width: `${(data.classes.ADULT / data.overview.totalProfiles) * 100}%` }}
                        />
                      </div>
                      <span className="text-coreezy-100 w-12 text-right">{data.classes.ADULT}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400">Teen</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-coreezy-800 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${(data.classes.TEEN / data.overview.totalProfiles) * 100}%` }}
                        />
                      </div>
                      <span className="text-coreezy-100 w-12 text-right">{data.classes.TEEN}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400">Baby</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-coreezy-800 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${(data.classes.BABY / data.overview.totalProfiles) * 100}%` }}
                        />
                      </div>
                      <span className="text-coreezy-100 w-12 text-right">{data.classes.BABY}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-coreezy-700 text-xs text-coreezy-500">
                  Prize distribution: {data.config.prizeDistribution.adult}% Adult / {data.config.prizeDistribution.teen}% Teen / {data.config.prizeDistribution.baby}% Baby
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-coreezy-100 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-canopy-400" />
                Recent Jobs
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-coreezy-500 border-b border-coreezy-700">
                      <th className="pb-2">Job</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Started</th>
                      <th className="pb-2">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentJobs.map((job) => (
                      <tr key={job.id} className="border-b border-coreezy-800">
                        <td className="py-2 text-coreezy-200">{job.name}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            job.status === 'success' 
                              ? 'bg-canopy-900/50 text-canopy-400' 
                              : job.status === 'error'
                              ? 'bg-red-900/50 text-red-400'
                              : 'bg-amber-900/50 text-amber-400'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-2 text-coreezy-400 text-xs">
                          {new Date(job.startedAt).toLocaleString()}
                        </td>
                        <td className="py-2 text-coreezy-400 text-xs">
                          {job.completedAt ? new Date(job.completedAt).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  highlight = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number | string; 
  highlight?: boolean;
}) {
  return (
    <div className={`card p-4 ${highlight ? 'border-amber-600' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`${highlight ? 'text-amber-400' : 'text-canopy-400'}`}>
          {icon}
        </div>
        <div>
          <div className={`text-2xl font-bold ${highlight ? 'text-amber-400' : 'text-coreezy-100'}`}>
            {value}
          </div>
          <div className="text-xs text-coreezy-400">{label}</div>
        </div>
      </div>
    </div>
  );
}
