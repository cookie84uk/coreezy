import { NextResponse } from 'next/server';

const COREEZY_VALIDATOR = 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';

export async function GET() {
  try {
    // Fetch validator info
    const [validatorRes, delegationsRes] = await Promise.all([
      fetch(`${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }),
      fetch(
        `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}/delegations?pagination.limit=1`,
        { next: { revalidate: 300 } }
      ),
    ]);

    if (!validatorRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch validator' }, { status: 500 });
    }

    const validatorData = await validatorRes.json();
    const delegationsData = await delegationsRes.json();

    const validator = validatorData.validator;
    const totalDelegators = delegationsData.pagination?.total || 0;

    // Convert tokens from ucore to CORE
    const totalStaked = BigInt(validator.tokens || '0');
    const totalStakedCore = Number(totalStaked) / 1_000_000;

    // Commission rate (stored as decimal string, e.g., "0.020000000000000000")
    const commissionRate = parseFloat(validator.commission?.commission_rates?.rate || '0') * 100;

    return NextResponse.json({
      validator: {
        operatorAddress: validator.operator_address,
        moniker: validator.description?.moniker || 'Coreezy',
        website: validator.description?.website || 'https://coreezy.xyz',
        details: validator.description?.details || '',
        status: validator.status,
        jailed: validator.jailed,
        tokens: validator.tokens,
        totalStakedCore: totalStakedCore.toFixed(2),
        delegatorShares: validator.delegator_shares,
        commission: {
          rate: commissionRate.toFixed(1),
          maxRate: parseFloat(validator.commission?.commission_rates?.max_rate || '0') * 100,
          maxChangeRate: parseFloat(validator.commission?.commission_rates?.max_change_rate || '0') * 100,
        },
        totalDelegators: parseInt(totalDelegators),
      },
    });
  } catch (error) {
    console.error('Failed to fetch validator stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
