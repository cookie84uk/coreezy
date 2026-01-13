export const COREUM_CONFIG = {
  mainnet: {
    chainId: 'coreum-mainnet-1',
    chainName: 'Coreum',
    rpc: process.env.COREUM_RPC || 'https://full-node.mainnet-1.coreum.dev:26657',
    rest: process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317',
    stakeCurrency: {
      coinDenom: 'CORE',
      coinMinimalDenom: 'ucore',
      coinDecimals: 6,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'core',
      bech32PrefixAccPub: 'corepub',
      bech32PrefixValAddr: 'corevaloper',
      bech32PrefixValPub: 'corevaloperpub',
      bech32PrefixConsAddr: 'corevalcons',
      bech32PrefixConsPub: 'corevalconspub',
    },
    currencies: [
      { coinDenom: 'CORE', coinMinimalDenom: 'ucore', coinDecimals: 6 },
    ],
    feeCurrencies: [
      {
        coinDenom: 'CORE',
        coinMinimalDenom: 'ucore',
        coinDecimals: 6,
        gasPriceStep: { low: 0.0625, average: 0.1, high: 0.15 },
      },
    ],
    features: ['cosmwasm', 'ibc-transfer', 'ibc-go'],
  },
  testnet: {
    chainId: 'coreum-testnet-1',
    chainName: 'Coreum Testnet',
    rpc: 'https://full-node.testnet-1.coreum.dev:26657',
    rest: 'https://full-node.testnet-1.coreum.dev:1317',
    stakeCurrency: {
      coinDenom: 'TESTCORE',
      coinMinimalDenom: 'utestcore',
      coinDecimals: 6,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'testcore',
      bech32PrefixAccPub: 'testcorepub',
      bech32PrefixValAddr: 'testcorevaloper',
      bech32PrefixValPub: 'testcorevaloperpub',
      bech32PrefixConsAddr: 'testcorevalcons',
      bech32PrefixConsPub: 'testcorevalconspub',
    },
    currencies: [
      { coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 },
    ],
    feeCurrencies: [
      {
        coinDenom: 'TESTCORE',
        coinMinimalDenom: 'utestcore',
        coinDecimals: 6,
        gasPriceStep: { low: 0.0625, average: 0.1, high: 0.15 },
      },
    ],
    features: ['cosmwasm', 'ibc-transfer', 'ibc-go'],
  },
} as const;

// Coreezy Validator address
export const COREEZY_VALIDATOR =
  process.env.COREEZY_VALIDATOR ||
  'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';

// Get current network config based on environment
export function getNetworkConfig() {
  const network = process.env.COREUM_NETWORK || 'mainnet';
  return COREUM_CONFIG[network as keyof typeof COREUM_CONFIG];
}

// Explorer URLs
export const EXPLORER_URLS = {
  mainnet: {
    mintscan: 'https://www.mintscan.io/coreum',
    coreum: 'https://explorer.coreum.com/coreum',
  },
  testnet: {
    mintscan: 'https://www.mintscan.io/coreum-testnet',
    coreum: 'https://explorer.testnet-1.coreum.dev',
  },
};

export function getValidatorUrl(validatorAddress: string = COREEZY_VALIDATOR) {
  const network = process.env.COREUM_NETWORK || 'mainnet';
  const urls = EXPLORER_URLS[network as keyof typeof EXPLORER_URLS];
  return {
    mintscan: `${urls.mintscan}/validators/${validatorAddress}`,
    coreum: `${urls.coreum}/validators/${validatorAddress}`,
  };
}

// Race configuration
export const RACE_CONFIG = {
  delegationCap: BigInt(50_000 * 1_000_000), // 50,000 CORE in ucore
  restakeMultiplier: 10, // 10%
  siteVisitBonus: 2, // 2%
  undelegationSleepDays: 3,
  maxBoostPercent: 15,
  boostDurationHours: 48,
  platforms: ['X', 'TikTok', 'Instagram', 'Reddit'] as const,
  boostMultiplierPerPlatform: 5, // 5% per platform
};

// Vault configuration
export const VAULT_CONFIG = {
  minHolderAmount: BigInt(10_000 * 1_000_000), // 10,000 COREZ minimum
  initialPhase: {
    reinvestPercent: 50,
    marketingPercent: 10,
    ogNftPercent: 40,
    dripPercent: 0,
  },
  finalPhase: {
    reinvestPercent: 15,
    marketingPercent: 10,
    ogNftPercent: 20,
    dripPercent: 50,
    futureNftPercent: 5,
  },
};

export type NetworkType = 'mainnet' | 'testnet';
export type Platform = (typeof RACE_CONFIG.platforms)[number];
