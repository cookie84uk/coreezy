import { NextResponse } from 'next/server';

const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';
const COREEZY_VALIDATOR = 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';

// Wallet addresses from the current dashboard
const WALLETS = {
  mainVault: 'core1lg2mh0x0wgkgq5rcwd7d2gn7sr3x56mh6kc5yx',
  treasury: 'core1fzrxzy2n6tqxcymj9rgep4kh2v3uyya7759xzm',
};

// COREZ token denom (you may need to update this with actual denom)
const COREZ_DENOM = 'ucorez';

interface WalletBalance {
  address: string;
  core: number;
  coreStaked: number;
  corez: number;
}

async function getBalance(address: string, denom: string): Promise<number> {
  try {
    const response = await fetch(
      `${COREUM_REST}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    return Number(data.balance?.amount || 0);
  } catch {
    return 0;
  }
}

async function getAllBalances(address: string): Promise<{ denom: string; amount: string }[]> {
  try {
    const response = await fetch(
      `${COREUM_REST}/cosmos/bank/v1beta1/balances/${address}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.balances || [];
  } catch {
    return [];
  }
}

async function getStakedAmount(address: string): Promise<number> {
  try {
    const response = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/delegations/${address}`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    
    let total = 0;
    for (const d of data.delegation_responses || []) {
      total += Number(d.balance?.amount || 0);
    }
    return total;
  } catch {
    return 0;
  }
}

async function getDelegationToValidator(address: string): Promise<number> {
  try {
    const response = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}/delegations/${address}`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    return Number(data.delegation_response?.balance?.amount || 0);
  } catch {
    return 0;
  }
}

async function getWalletData(address: string): Promise<WalletBalance> {
  const [coreBalance, stakedAmount, allBalances] = await Promise.all([
    getBalance(address, 'ucore'),
    getStakedAmount(address),
    getAllBalances(address),
  ]);

  // Find COREZ balance - look for tokens that might be COREZ
  let corezBalance = 0;
  for (const balance of allBalances) {
    // Check for COREZ denom - it might be a smart token with a different format
    if (balance.denom.toLowerCase().includes('corez') || balance.denom === COREZ_DENOM) {
      corezBalance = Number(balance.amount);
      break;
    }
  }

  return {
    address,
    core: coreBalance / 1_000_000, // Convert from ucore to CORE (6 decimals)
    coreStaked: stakedAmount / 1_000_000,
    corez: corezBalance / 1_000_000, // Convert from ucorez to COREZ (6 decimals)
  };
}

export async function GET() {
  try {
    // Fetch data for both wallets in parallel
    const [mainVault, treasury, validatorInfo] = await Promise.all([
      getWalletData(WALLETS.mainVault),
      getWalletData(WALLETS.treasury),
      fetch(`${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}`)
        .then(r => r.json())
        .catch(() => null),
    ]);

    // Calculate totals
    const totalCore = mainVault.core + treasury.core;
    const totalCoreStaked = mainVault.coreStaked + treasury.coreStaked;
    const totalCorez = mainVault.corez + treasury.corez;

    // Get validator stats
    const validatorTokens = validatorInfo?.validator?.tokens 
      ? Number(validatorInfo.validator.tokens) / 1_000_000 
      : 0;

    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      wallets: {
        mainVault: {
          label: 'Coreezy Main Vault',
          ...mainVault,
        },
        treasury: {
          label: 'Marketing/Developer/Treasury',
          ...treasury,
        },
      },
      totals: {
        core: totalCore,
        coreStaked: totalCoreStaked,
        corez: totalCorez,
        validatorTotalStaked: validatorTokens,
      },
      validator: {
        address: COREEZY_VALIDATOR,
        totalStaked: validatorTokens,
        status: validatorInfo?.validator?.status || 'UNKNOWN',
      },
    });
  } catch (error) {
    console.error('Failed to fetch holdings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holdings data' },
      { status: 500 }
    );
  }
}
