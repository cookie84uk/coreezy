import { NextRequest, NextResponse } from 'next/server';

/**
 * Cron endpoint for daily snapshot
 * 
 * This endpoint is called by Railway cron or external cron services.
 * It verifies the request using CRON_SECRET and then triggers the snapshot.
 * 
 * Railway cron: Set up a cron job to hit this endpoint daily
 * External cron: Use cron-job.org, Upstash, or similar
 */

const CRON_SECRET = process.env.CRON_SECRET || process.env.ADMIN_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
  : 'http://localhost:3000';

export async function GET(request: NextRequest) {
  // Verify cron secret (from header or query param)
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get('secret');
  
  const providedSecret = authHeader?.replace('Bearer ', '') || querySecret;
  
  if (!CRON_SECRET || providedSecret !== CRON_SECRET) {
    console.log('[Cron] Unauthorized snapshot attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[Cron] Starting scheduled snapshot...');

  try {
    // Call the actual snapshot endpoint
    const response = await fetch(`${BASE_URL}/api/admin/snapshot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('[Cron] Snapshot completed successfully:', result);
      return NextResponse.json({
        success: true,
        message: 'Daily snapshot completed',
        timestamp: new Date().toISOString(),
        result,
      });
    } else {
      console.error('[Cron] Snapshot failed:', result);
      return NextResponse.json({
        success: false,
        error: result.error || 'Snapshot failed',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[Cron] Snapshot error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to execute snapshot',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
