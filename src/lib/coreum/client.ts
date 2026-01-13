import { StargateClient, QueryClient } from '@cosmjs/stargate';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { getNetworkConfig, COREEZY_VALIDATOR } from '@/config/coreum';

export interface DelegatorInfo {
  address: string;
  shares: string;
  balance: {
    denom: string;
    amount: string;
  };
}

export interface ValidatorInfo {
  operatorAddress: string;
  tokens: string;
  delegatorShares: string;
  commission: {
    rate: string;
  };
  status: string;
  jailed: boolean;
  description: {
    moniker: string;
    website: string;
    details: string;
  };
}

export interface DelegationReward {
  validatorAddress: string;
  reward: Array<{
    denom: string;
    amount: string;
  }>;
}

class CoreumClientSingleton {
  private static instance: CoreumClientSingleton;
  private client: StargateClient | null = null;
  private tmClient: Tendermint37Client | null = null;

  private constructor() {}

  static getInstance(): CoreumClientSingleton {
    if (!CoreumClientSingleton.instance) {
      CoreumClientSingleton.instance = new CoreumClientSingleton();
    }
    return CoreumClientSingleton.instance;
  }

  async connect(): Promise<StargateClient> {
    if (this.client) {
      return this.client;
    }

    const config = getNetworkConfig();
    this.tmClient = await Tendermint37Client.connect(config.rpc);
    this.client = await StargateClient.create(this.tmClient);
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.tmClient) {
      this.tmClient.disconnect();
      this.tmClient = null;
      this.client = null;
    }
  }

  // Get validator info
  async getValidator(
    validatorAddress: string = COREEZY_VALIDATOR
  ): Promise<ValidatorInfo | null> {
    const client = await this.connect();
    const config = getNetworkConfig();

    try {
      const response = await fetch(
        `${config.rest}/cosmos/staking/v1beta1/validators/${validatorAddress}`
      );
      const data = await response.json();
      return data.validator;
    } catch (error) {
      console.error('Failed to fetch validator info:', error);
      return null;
    }
  }

  // Get all delegations to the Coreezy validator
  async getValidatorDelegations(
    validatorAddress: string = COREEZY_VALIDATOR,
    paginationKey?: string
  ): Promise<{
    delegations: DelegatorInfo[];
    nextKey: string | null;
  }> {
    const config = getNetworkConfig();

    try {
      const params = new URLSearchParams();
      params.set('pagination.limit', '1000');
      if (paginationKey) {
        params.set('pagination.key', paginationKey);
      }

      const response = await fetch(
        `${config.rest}/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations?${params}`
      );
      const data = await response.json();

      const delegations: DelegatorInfo[] =
        data.delegation_responses?.map((d: any) => ({
          address: d.delegation.delegator_address,
          shares: d.delegation.shares,
          balance: d.balance,
        })) || [];

      return {
        delegations,
        nextKey: data.pagination?.next_key || null,
      };
    } catch (error) {
      console.error('Failed to fetch validator delegations:', error);
      return { delegations: [], nextKey: null };
    }
  }

  // Get all delegators (handles pagination)
  async getAllDelegators(
    validatorAddress: string = COREEZY_VALIDATOR
  ): Promise<DelegatorInfo[]> {
    const allDelegators: DelegatorInfo[] = [];
    let nextKey: string | null = null;

    do {
      const result = await this.getValidatorDelegations(
        validatorAddress,
        nextKey || undefined
      );
      allDelegators.push(...result.delegations);
      nextKey = result.nextKey;
    } while (nextKey);

    return allDelegators;
  }

  // Get delegation for a specific address
  async getDelegation(
    delegatorAddress: string,
    validatorAddress: string = COREEZY_VALIDATOR
  ): Promise<DelegatorInfo | null> {
    const config = getNetworkConfig();

    try {
      const response = await fetch(
        `${config.rest}/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${delegatorAddress}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const d = data.delegation_response;

      return {
        address: d.delegation.delegator_address,
        shares: d.delegation.shares,
        balance: d.balance,
      };
    } catch (error) {
      console.error('Failed to fetch delegation:', error);
      return null;
    }
  }

  // Get staking rewards for a delegator
  async getDelegationRewards(
    delegatorAddress: string,
    validatorAddress: string = COREEZY_VALIDATOR
  ): Promise<DelegationReward | null> {
    const config = getNetworkConfig();

    try {
      const response = await fetch(
        `${config.rest}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards/${validatorAddress}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        validatorAddress,
        reward: data.rewards || [],
      };
    } catch (error) {
      console.error('Failed to fetch delegation rewards:', error);
      return null;
    }
  }

  // Get account balance
  async getBalance(
    address: string,
    denom: string = 'ucore'
  ): Promise<{ denom: string; amount: string }> {
    const client = await this.connect();
    return client.getBalance(address, denom);
  }

  // Get block height
  async getBlockHeight(): Promise<number> {
    const client = await this.connect();
    return client.getHeight();
  }

  // Check if address has active auto-restake (approximation via delegation history)
  // Note: Auto-restake is typically handled by external services, not on-chain
  async checkRestakeStatus(delegatorAddress: string): Promise<boolean> {
    // This would typically integrate with a restake service API
    // For now, return a placeholder
    // TODO: Integrate with actual restake service (REStake, etc.)
    return true;
  }
}

// Export singleton instance
export const coreumClient = CoreumClientSingleton.getInstance();

// Helper to format ucore to CORE
export function formatCore(ucore: string | bigint, decimals: number = 2): string {
  const amount = typeof ucore === 'string' ? BigInt(ucore) : ucore;
  const divisor = BigInt(1_000_000);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (decimals === 0) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(6, '0').slice(0, decimals);
  return `${whole}.${fractionStr}`;
}

// Helper to parse CORE to ucore
export function parseCore(core: string | number): bigint {
  const amount = typeof core === 'string' ? parseFloat(core) : core;
  return BigInt(Math.floor(amount * 1_000_000));
}
