import { NextRequest, NextResponse } from 'next/server';

const COREEZY_VALIDATOR = 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}/delegations/${address}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      return NextResponse.json({ delegation: null });
    }

    const data = await response.json();
    const d = data.delegation_response;

    return NextResponse.json({
      delegation: {
        address: d.delegation.delegator_address,
        shares: d.delegation.shares,
        balance: d.balance,
      },
    });
  } catch (error) {
    console.error('Failed to fetch delegation:', error);
    return NextResponse.json({ delegation: null });
  }
}
