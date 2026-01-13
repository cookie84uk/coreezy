import { NextRequest, NextResponse } from 'next/server';

const COREEZY_VALIDATOR = 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '100';
  const paginationKey = searchParams.get('key') || '';

  try {
    const params = new URLSearchParams();
    params.set('pagination.limit', limit);
    if (paginationKey) {
      params.set('pagination.key', paginationKey);
    }

    const response = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}/delegations?${params}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch delegators' }, { status: 500 });
    }

    const data = await response.json();

    const delegators = (data.delegation_responses || []).map((d: any) => ({
      address: d.delegation.delegator_address,
      shares: d.delegation.shares,
      amount: d.balance.amount,
      amountCore: (Number(d.balance.amount) / 1_000_000).toFixed(2),
    }));

    // Sort by amount descending
    delegators.sort((a: any, b: any) => Number(b.amount) - Number(a.amount));

    return NextResponse.json({
      delegators,
      pagination: {
        nextKey: data.pagination?.next_key || null,
        total: data.pagination?.total || delegators.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch delegators:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
