#!/usr/bin/env node
/**
 * Cron Worker for Coreezy Sloth Race
 * 
 * This script runs as a separate Railway service to execute scheduled tasks.
 * 
 * Environment variables needed:
 * - CRON_SECRET or ADMIN_SECRET
 * - API_BASE_URL (e.g., https://web-production-61ac1.up.railway.app)
 * 
 * Schedule:
 * - Daily snapshot: 00:05 UTC (5 minutes after midnight)
 */

const CRON_SECRET = process.env.CRON_SECRET || process.env.ADMIN_SECRET;
const API_BASE_URL = process.env.API_BASE_URL || process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : null;

async function runSnapshot() {
  if (!API_BASE_URL) {
    console.error('[Cron] API_BASE_URL not configured');
    return false;
  }

  if (!CRON_SECRET) {
    console.error('[Cron] CRON_SECRET not configured');
    return false;
  }

  console.log(`[Cron] Running daily snapshot at ${new Date().toISOString()}`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/snapshot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('[Cron] Snapshot completed:', JSON.stringify(result, null, 2));
      return true;
    } else {
      console.error('[Cron] Snapshot failed:', result);
      return false;
    }
  } catch (error) {
    console.error('[Cron] Error:', error.message);
    return false;
  }
}

// Calculate ms until next run (00:05 UTC daily)
function msUntilNextRun() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(0, 5, 0, 0); // 00:05 UTC
  
  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  
  return next.getTime() - now.getTime();
}

function formatDuration(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

async function main() {
  console.log('[Cron] Coreezy Cron Worker starting...');
  console.log(`[Cron] API_BASE_URL: ${API_BASE_URL}`);
  console.log(`[Cron] CRON_SECRET: ${CRON_SECRET ? '***configured***' : 'NOT SET'}`);

  // Run immediately on startup if requested
  if (process.argv.includes('--run-now')) {
    console.log('[Cron] Running snapshot immediately...');
    await runSnapshot();
    if (!process.argv.includes('--daemon')) {
      process.exit(0);
    }
  }

  // Schedule loop
  while (true) {
    const delay = msUntilNextRun();
    console.log(`[Cron] Next snapshot in ${formatDuration(delay)} (00:05 UTC)`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    await runSnapshot();
    
    // Small delay to prevent double-runs
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}

main().catch(console.error);
