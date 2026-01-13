# Coreezy Platform - Technical Specification
## Full Ground-Up Build with Coreum Integration

**Version:** 1.0  
**Date:** January 12, 2026  

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js 14+)                        │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌─────────────────┐  │
│  │   Public    │ │  Dashboard   │ │ Sloth Race  │ │  Institutional  │  │
│  │   Pages     │ │   (Auth)     │ │  (Wallet)   │ │     Portal      │  │
│  └─────────────┘ └──────────────┘ └─────────────┘ └─────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                           API LAYER (Next.js API Routes / tRPC)         │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌─────────────────┐  │
│  │   Auth      │ │  Snapshot    │ │   Race      │ │    Admin        │  │
│  │   Routes    │ │   Service    │ │   Engine    │ │    Routes       │  │
│  └─────────────┘ └──────────────┘ └─────────────┘ └─────────────────┘  │
└───────┬─────────────────┬────────────────┬──────────────────┬───────────┘
        │                 │                │                  │
┌───────▼───────┐ ┌───────▼───────┐ ┌──────▼──────┐ ┌────────▼────────┐
│   PostgreSQL  │ │    Redis      │ │   Coreum    │ │  Smart Contracts│
│   (Primary)   │ │   (Cache)     │ │  Blockchain │ │   (CosmWasm)    │
└───────────────┘ └───────────────┘ └─────────────┘ └─────────────────┘
```

---

## 2. Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14+ | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State management |
| TanStack Query | Data fetching/caching |
| CosmJS | Coreum blockchain interaction |
| @keplr-wallet/types | Wallet type definitions |

### Backend
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Primary API |
| tRPC (optional) | Type-safe API layer |
| Prisma | ORM |
| PostgreSQL | Primary database |
| Redis | Caching, rate limiting, sessions |
| Bull/BullMQ | Job queue (snapshots, scoring) |

### Blockchain
| Technology | Purpose |
|------------|---------|
| CosmJS (@cosmjs/*) | Coreum client libraries |
| CosmWasm | Smart contract runtime |
| Rust | Smart contract language |
| coreum-wasm-sdk | Coreum-specific bindings |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Vercel | Frontend hosting |
| Railway/Render | Backend services |
| Supabase | PostgreSQL + Auth (optional) |
| Upstash | Serverless Redis |
| Cloudflare | CDN, DNS, protection |

---

## 3. Coreum Integration

### 3.1 Network Configuration

```typescript
// config/coreum.ts
export const COREUM_CONFIG = {
  mainnet: {
    chainId: 'coreum-mainnet-1',
    chainName: 'Coreum',
    rpc: 'https://full-node.mainnet-1.coreum.dev:26657',
    rest: 'https://full-node.mainnet-1.coreum.dev:1317',
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
      { coinDenom: 'CORE', coinMinimalDenom: 'ucore', coinDecimals: 6 },
    ],
    gasPriceStep: { low: 0.0625, average: 0.1, high: 0.15 },
    explorer: 'https://explorer.coreum.com/coreum',
  },
  testnet: {
    chainId: 'coreum-testnet-1',
    chainName: 'Coreum Testnet',
    rpc: 'https://full-node.testnet-1.coreum.dev:26657',
    rest: 'https://full-node.testnet-1.coreum.dev:1317',
    // ... same structure
  },
} as const;

// Validator address
export const COREEZY_VALIDATOR = 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
```

### 3.2 Client Setup

```typescript
// lib/coreum/client.ts
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { COREUM_CONFIG, COREEZY_VALIDATOR } from '@/config/coreum';

export class CoreumClient {
  private client: StargateClient | null = null;
  
  async connect() {
    this.client = await StargateClient.connect(COREUM_CONFIG.mainnet.rpc);
    return this.client;
  }

  async getValidatorDelegations(validatorAddress = COREEZY_VALIDATOR) {
    const client = await this.connect();
    return client.staking.validatorDelegations(validatorAddress);
  }

  async getDelegation(delegatorAddress: string) {
    const client = await this.connect();
    return client.staking.delegation(delegatorAddress, COREEZY_VALIDATOR);
  }

  async getStakingRewards(delegatorAddress: string) {
    const client = await this.connect();
    return client.distribution.delegationRewards(delegatorAddress, COREEZY_VALIDATOR);
  }

  async getAllDelegators(): Promise<DelegatorInfo[]> {
    const client = await this.connect();
    const delegations = await this.getValidatorDelegations();
    
    return delegations.delegationResponses.map((d) => ({
      address: d.delegation.delegatorAddress,
      shares: d.delegation.shares,
      balance: d.balance,
    }));
  }
}
```

### 3.3 Wallet Integration

```typescript
// lib/coreum/wallet.ts
import { Window as KeplrWindow } from '@keplr-wallet/types';
import { COREUM_CONFIG } from '@/config/coreum';

declare global {
  interface Window extends KeplrWindow {}
}

export async function connectKeplr() {
  if (!window.keplr) {
    throw new Error('Keplr wallet not installed');
  }

  await window.keplr.experimentalSuggestChain({
    ...COREUM_CONFIG.mainnet,
    features: ['cosmwasm', 'ibc-transfer', 'ibc-go'],
  });

  await window.keplr.enable(COREUM_CONFIG.mainnet.chainId);
  
  const offlineSigner = window.keplr.getOfflineSigner(COREUM_CONFIG.mainnet.chainId);
  const accounts = await offlineSigner.getAccounts();
  
  return {
    address: accounts[0].address,
    signer: offlineSigner,
  };
}

export async function connectLeapWallet() {
  if (!window.leap) {
    throw new Error('Leap wallet not installed');
  }
  
  await window.leap.experimentalSuggestChain(COREUM_CONFIG.mainnet);
  await window.leap.enable(COREUM_CONFIG.mainnet.chainId);
  
  const offlineSigner = window.leap.getOfflineSigner(COREUM_CONFIG.mainnet.chainId);
  const accounts = await offlineSigner.getAccounts();
  
  return {
    address: accounts[0].address,
    signer: offlineSigner,
  };
}
```

---

## 4. Smart Contract Architecture

### 4.1 Contract Overview

We'll deploy 3 primary smart contracts on Coreum:

| Contract | Purpose |
|----------|---------|
| `coreezy-vault` | Manages vault deposits, staking rewards distribution |
| `coreezy-race` | Sloth Race scoring, snapshots, leaderboard |
| `coreezy-rewards` | Automated reward distribution to delegators/NFT holders |

### 4.2 Vault Contract (Rust/CosmWasm)

```rust
// contracts/coreezy-vault/src/lib.rs
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, Uint128, Addr, BankMsg, Coin,
};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// State
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub corez_denom: String,
    pub coreum_denom: String,
    pub reinvest_percent: u8,      // 50 = 50%
    pub marketing_percent: u8,     // 10 = 10%
    pub og_nft_percent: u8,        // 40 = 40% (initial phase)
    pub drip_percent: u8,          // 0 initially, 50 in final phase
    pub min_holder_amount: Uint128, // 10,000 COREZ
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct VaultState {
    pub total_coreum: Uint128,
    pub total_corez: Uint128,
    pub last_distribution: u64,
    pub phase: VaultPhase,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum VaultPhase {
    Initial,  // Before 1 COREZ = 1.5 COREUM
    Final,    // After milestone achieved
}

const CONFIG: Item<Config> = Item::new("config");
const VAULT_STATE: Item<VaultState> = Item::new("vault_state");
const ELIGIBLE_HOLDERS: Map<&Addr, Uint128> = Map::new("eligible_holders");

// Messages
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub corez_denom: String,
    pub min_holder_amount: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Deposit {},
    DistributeRewards {},
    UpdateEligibleHolders { holders: Vec<(String, Uint128)> },
    TransitionToFinalPhase {},
    UpdateConfig { config: Config },
    WithdrawMarketing { amount: Uint128, recipient: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    Config {},
    VaultState {},
    EligibleHolder { address: String },
    TotalEligibleHolders {},
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let config = Config {
        admin: info.sender.clone(),
        corez_denom: msg.corez_denom,
        coreum_denom: "ucore".to_string(),
        reinvest_percent: 50,
        marketing_percent: 10,
        og_nft_percent: 40,
        drip_percent: 0,
        min_holder_amount: msg.min_holder_amount,
    };
    
    CONFIG.save(deps.storage, &config)?;
    
    let state = VaultState {
        total_coreum: Uint128::zero(),
        total_corez: Uint128::zero(),
        last_distribution: 0,
        phase: VaultPhase::Initial,
    };
    
    VAULT_STATE.save(deps.storage, &state)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Deposit {} => execute_deposit(deps, env, info),
        ExecuteMsg::DistributeRewards {} => execute_distribute(deps, env, info),
        ExecuteMsg::UpdateEligibleHolders { holders } => {
            execute_update_holders(deps, info, holders)
        }
        ExecuteMsg::TransitionToFinalPhase {} => execute_transition_phase(deps, info),
        ExecuteMsg::UpdateConfig { config } => execute_update_config(deps, info, config),
        ExecuteMsg::WithdrawMarketing { amount, recipient } => {
            execute_withdraw_marketing(deps, info, amount, recipient)
        }
    }
}

fn execute_deposit(deps: DepsMut, _env: Env, info: MessageInfo) -> StdResult<Response> {
    let mut state = VAULT_STATE.load(deps.storage)?;
    let config = CONFIG.load(deps.storage)?;
    
    // Find COREUM deposit
    let coreum_amount = info
        .funds
        .iter()
        .find(|c| c.denom == config.coreum_denom)
        .map(|c| c.amount)
        .unwrap_or(Uint128::zero());
    
    state.total_coreum += coreum_amount;
    VAULT_STATE.save(deps.storage, &state)?;
    
    Ok(Response::new()
        .add_attribute("method", "deposit")
        .add_attribute("amount", coreum_amount))
}

fn execute_distribute(deps: DepsMut, env: Env, info: MessageInfo) -> StdResult<Response> {
    let config = CONFIG.load(deps.storage)?;
    let mut state = VAULT_STATE.load(deps.storage)?;
    
    // Only admin can trigger distribution
    if info.sender != config.admin {
        return Err(cosmwasm_std::StdError::generic_err("Unauthorized"));
    }
    
    // Calculate distributions based on phase
    let total = state.total_coreum;
    let reinvest = total * Uint128::from(config.reinvest_percent as u128) / Uint128::from(100u128);
    let marketing = total * Uint128::from(config.marketing_percent as u128) / Uint128::from(100u128);
    
    let mut messages: Vec<BankMsg> = vec![];
    
    // Marketing withdrawal (to be claimed separately)
    // Reinvestment stays in contract
    // OG NFT / Drip rewards calculated off-chain and distributed
    
    state.last_distribution = env.block.time.seconds();
    VAULT_STATE.save(deps.storage, &state)?;
    
    Ok(Response::new()
        .add_attribute("method", "distribute")
        .add_attribute("total", total)
        .add_attribute("reinvest", reinvest)
        .add_attribute("marketing", marketing))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_binary(&CONFIG.load(deps.storage)?),
        QueryMsg::VaultState {} => to_binary(&VAULT_STATE.load(deps.storage)?),
        QueryMsg::EligibleHolder { address } => {
            let addr = deps.api.addr_validate(&address)?;
            let amount = ELIGIBLE_HOLDERS.may_load(deps.storage, &addr)?;
            to_binary(&amount)
        }
        QueryMsg::TotalEligibleHolders {} => {
            let count: u64 = ELIGIBLE_HOLDERS
                .keys(deps.storage, None, None, cosmwasm_std::Order::Ascending)
                .count() as u64;
            to_binary(&count)
        }
    }
}
```

### 4.3 Race Contract (Rust/CosmWasm)

```rust
// contracts/coreezy-race/src/lib.rs
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, Uint128, Addr,
};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// Sloth Classes
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum SlothClass {
    Baby,   // Bottom 33%
    Teen,   // Middle 33%
    Adult,  // Top 33%
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct SlothProfile {
    pub address: Addr,
    pub name: Option<String>,
    pub class: SlothClass,
    pub total_score: Uint128,
    pub delegation_score: Uint128,
    pub restake_streak: u32,
    pub days_awake: u32,
    pub is_sleeping: bool,
    pub sleep_until: Option<u64>,
    pub active_boosts: Vec<Boost>,
    pub last_site_visit: Option<u64>,
    pub joined_timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Boost {
    pub platform: String,
    pub multiplier: u8,  // e.g., 5 = 5%
    pub expires_at: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct DailySnapshot {
    pub timestamp: u64,
    pub delegator: Addr,
    pub delegation_amount: Uint128,
    pub net_change: i128,
    pub restake_active: bool,
    pub undelegated: bool,
    pub site_visited: bool,
    pub daily_score: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct RaceConfig {
    pub admin: Addr,
    pub delegation_cap: Uint128,           // e.g., 50,000 CORE
    pub restake_multiplier: u8,            // e.g., 10 = 10%
    pub site_visit_bonus: u8,              // e.g., 2 = 2%
    pub undelegation_sleep_days: u32,      // e.g., 3 days
    pub max_boost_percent: u8,             // e.g., 15%
    pub boost_duration_hours: u32,         // e.g., 48 hours
    pub season_start: u64,
    pub season_end: u64,
}

const RACE_CONFIG: Item<RaceConfig> = Item::new("race_config");
const SLOTH_PROFILES: Map<&Addr, SlothProfile> = Map::new("sloth_profiles");
const DAILY_SNAPSHOTS: Map<(&Addr, u64), DailySnapshot> = Map::new("daily_snapshots");
const LEADERBOARD: Item<Vec<(Addr, Uint128)>> = Item::new("leaderboard");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // Admin functions
    InitializeSeason { config: RaceConfig },
    RecordDailySnapshot { snapshots: Vec<DailySnapshot> },
    CalculateClasses {},
    UpdateLeaderboard {},
    
    // User functions
    RegisterSloth { name: Option<String> },
    RecordSiteVisit {},
    SubmitSocialBoost { platform: String, proof_url: String },
    UpdateSlothName { name: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    RaceConfig {},
    SlothProfile { address: String },
    Leaderboard { limit: Option<u32>, class: Option<SlothClass> },
    ClassThresholds {},
    SeasonStats {},
    DailySnapshot { address: String, timestamp: u64 },
}

// Scoring logic
fn calculate_daily_score(
    config: &RaceConfig,
    snapshot: &DailySnapshot,
    profile: &SlothProfile,
) -> Uint128 {
    if profile.is_sleeping {
        return Uint128::zero();
    }
    
    // Base score: capped delegation
    let capped_delegation = std::cmp::min(snapshot.delegation_amount, config.delegation_cap);
    let mut score = capped_delegation;
    
    // Restake multiplier
    if snapshot.restake_active {
        score = score * Uint128::from(100 + config.restake_multiplier as u128) / Uint128::from(100u128);
    }
    
    // Site visit bonus
    if snapshot.site_visited {
        score = score * Uint128::from(100 + config.site_visit_bonus as u128) / Uint128::from(100u128);
    }
    
    // Active boosts
    let total_boost: u8 = profile
        .active_boosts
        .iter()
        .map(|b| b.multiplier)
        .sum::<u8>()
        .min(config.max_boost_percent);
    
    score = score * Uint128::from(100 + total_boost as u128) / Uint128::from(100u128);
    
    score
}

fn determine_class(rank_percentile: f64) -> SlothClass {
    if rank_percentile <= 33.33 {
        SlothClass::Adult  // Top 33%
    } else if rank_percentile <= 66.66 {
        SlothClass::Teen   // Middle 33%
    } else {
        SlothClass::Baby   // Bottom 33%
    }
}
```

### 4.4 Contract Deployment

```bash
# Build contracts
cd contracts/coreezy-vault
cargo build --release --target wasm32-unknown-unknown

# Optimize
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.14.0

# Deploy to Coreum
cored tx wasm store artifacts/coreezy_vault.wasm \
  --from deployer \
  --chain-id coreum-mainnet-1 \
  --gas auto \
  --gas-adjustment 1.3 \
  --gas-prices 0.0625ucore

# Instantiate
cored tx wasm instantiate $CODE_ID \
  '{"corez_denom":"ucorez","min_holder_amount":"10000000000"}' \
  --from deployer \
  --label "coreezy-vault-v1" \
  --admin $(cored keys show deployer -a) \
  --chain-id coreum-mainnet-1 \
  --gas auto
```

---

## 5. Database Schema

```sql
-- Prisma schema (schema.prisma)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User/Wallet management
model User {
  id            String    @id @default(cuid())
  walletAddress String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Sloth Race
  slothProfile  SlothProfile?
  snapshots     DailySnapshot[]
  boostRequests BoostRequest[]
  
  // Institutional
  isInstitutional Boolean @default(false)
  companyName     String?
  contactEmail    String?
}

model SlothProfile {
  id              String      @id @default(cuid())
  userId          String      @unique
  user            User        @relation(fields: [userId], references: [id])
  
  name            String?
  class           SlothClass  @default(BABY)
  totalScore      BigInt      @default(0)
  delegationScore BigInt      @default(0)
  restakeStreak   Int         @default(0)
  daysAwake       Int         @default(0)
  isSleeping      Boolean     @default(false)
  sleepUntil      DateTime?
  lastSiteVisit   DateTime?
  joinedAt        DateTime    @default(now())
  
  activeBoosts    Boost[]
  
  @@index([class])
  @@index([totalScore])
}

enum SlothClass {
  BABY
  TEEN
  ADULT
}

model Boost {
  id            String       @id @default(cuid())
  profileId     String
  profile       SlothProfile @relation(fields: [profileId], references: [id])
  
  platform      String       // X, TikTok, Instagram, Reddit
  multiplier    Int          // Percentage
  expiresAt     DateTime
  proofUrl      String
  approvedAt    DateTime?
  
  @@index([profileId, expiresAt])
}

model BoostRequest {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  platform    String
  proofUrl    String
  status      BoostStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  reviewedAt  DateTime?
  reviewedBy  String?
  
  @@index([status])
}

enum BoostStatus {
  PENDING
  APPROVED
  REJECTED
}

model DailySnapshot {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  
  timestamp        DateTime
  delegationAmount BigInt
  netChange        BigInt
  restakeActive    Boolean
  undelegated      Boolean
  siteVisited      Boolean
  dailyScore       BigInt
  
  @@unique([userId, timestamp])
  @@index([timestamp])
}

model Season {
  id          String   @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(false)
  
  rewards     SeasonReward[]
  
  @@index([isActive])
}

model SeasonReward {
  id          String      @id @default(cuid())
  seasonId    String
  season      Season      @relation(fields: [seasonId], references: [id])
  
  class       SlothClass
  poolPercent Int         // 40, 35, or 25
  totalPool   BigInt
  distributed Boolean     @default(false)
}

// Vault tracking (mirror of on-chain state)
model VaultState {
  id               String   @id @default(cuid())
  timestamp        DateTime @default(now())
  totalCoreum      BigInt
  totalCorez       BigInt
  phase            VaultPhase
  lastDistribution DateTime?
}

enum VaultPhase {
  INITIAL
  FINAL
}

// Partner projects
model Partner {
  id          String   @id @default(cuid())
  name        String
  website     String
  logo        String?
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// Institutional inquiries
model InstitutionalInquiry {
  id           String   @id @default(cuid())
  companyName  String
  contactName  String
  email        String
  phone        String?
  message      String
  status       InquiryStatus @default(NEW)
  createdAt    DateTime      @default(now())
  respondedAt  DateTime?
}

enum InquiryStatus {
  NEW
  CONTACTED
  NDA_SENT
  IN_PROGRESS
  CLOSED
}
```

---

## 6. API Architecture

### 6.1 Route Structure

```
/api
├── /auth
│   ├── POST /connect          # Wallet connection
│   ├── POST /verify           # Signature verification
│   └── POST /disconnect       # Logout
│
├── /user
│   ├── GET /profile           # Get user profile
│   ├── PUT /profile           # Update profile
│   └── GET /[address]         # Public profile lookup
│
├── /race
│   ├── GET /leaderboard       # Get leaderboard
│   ├── GET /classes           # Get class thresholds
│   ├── GET /profile/[address] # Get sloth profile
│   ├── POST /site-visit       # Record site visit
│   └── POST /boost            # Submit boost request
│
├── /vault
│   ├── GET /state             # Current vault state
│   ├── GET /history           # Distribution history
│   └── GET /eligibility       # Check drip eligibility
│
├── /validator
│   ├── GET /stats             # Validator statistics
│   ├── GET /delegators        # Delegator list
│   └── GET /rewards           # Reward calculations
│
├── /admin
│   ├── POST /snapshot         # Trigger daily snapshot
│   ├── POST /calculate        # Run scoring calculation
│   ├── GET /boost-requests    # List pending boosts
│   ├── PUT /boost/[id]        # Approve/reject boost
│   └── POST /distribute       # Trigger distribution
│
└── /institutional
    ├── POST /inquiry          # Submit inquiry
    └── GET /documents/[token] # Gated document access
```

### 6.2 Core API Implementations

```typescript
// app/api/race/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const classFilter = searchParams.get('class');
  const page = parseInt(searchParams.get('page') || '1');

  // Check cache first
  const cacheKey = `leaderboard:${classFilter || 'all'}:${page}:${limit}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const where = classFilter ? { class: classFilter as SlothClass } : {};
  
  const [profiles, total] = await Promise.all([
    prisma.slothProfile.findMany({
      where,
      orderBy: { totalScore: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        user: { select: { walletAddress: true } },
      },
    }),
    prisma.slothProfile.count({ where }),
  ]);

  const result = {
    profiles: profiles.map((p, i) => ({
      rank: (page - 1) * limit + i + 1,
      address: p.user.walletAddress,
      name: p.name,
      class: p.class,
      score: p.totalScore.toString(),
      restakeStreak: p.restakeStreak,
      daysAwake: p.daysAwake,
      isSleeping: p.isSleeping,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  // Cache for 5 minutes
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);

  return NextResponse.json(result);
}
```

```typescript
// app/api/admin/snapshot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CoreumClient } from '@/lib/coreum/client';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Verify admin
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const coreum = new CoreumClient();
  const delegators = await coreum.getAllDelegators();
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Get yesterday's snapshots for net change calculation
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdaySnapshots = await prisma.dailySnapshot.findMany({
    where: { timestamp: yesterday },
  });
  
  const yesterdayMap = new Map(
    yesterdaySnapshots.map((s) => [s.userId, s.delegationAmount])
  );

  // Process each delegator
  const snapshots = [];
  for (const delegator of delegators) {
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: delegator.address },
      include: { slothProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: delegator.address,
          slothProfile: { create: {} },
        },
        include: { slothProfile: true },
      });
    }

    const delegationAmount = BigInt(delegator.balance.amount);
    const previousAmount = yesterdayMap.get(user.id) || BigInt(0);
    const netChange = delegationAmount - previousAmount;
    
    // Check for undelegation
    const undelegated = netChange < BigInt(0);
    
    // TODO: Check restake status from chain
    const restakeActive = true; // Placeholder
    
    // Check site visit (from Redis or session data)
    const siteVisited = await checkSiteVisit(user.id, today);

    const snapshot = await prisma.dailySnapshot.create({
      data: {
        userId: user.id,
        timestamp: today,
        delegationAmount,
        netChange,
        restakeActive,
        undelegated,
        siteVisited,
        dailyScore: BigInt(0), // Calculated in next step
      },
    });

    snapshots.push(snapshot);

    // Handle undelegation penalty
    if (undelegated && user.slothProfile) {
      const sleepUntil = new Date(today);
      sleepUntil.setDate(sleepUntil.getDate() + 3); // 3 day penalty
      
      await prisma.slothProfile.update({
        where: { id: user.slothProfile.id },
        data: {
          isSleeping: true,
          sleepUntil,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    processed: snapshots.length,
    timestamp: today.toISOString(),
  });
}
```

---

## 7. Background Jobs

```typescript
// jobs/dailySnapshot.ts
import { Queue, Worker } from 'bullmq';
import { redis } from '@/lib/redis';

export const snapshotQueue = new Queue('daily-snapshot', {
  connection: redis,
});

// Schedule daily at 00:00 UTC
snapshotQueue.add(
  'daily-snapshot',
  {},
  {
    repeat: {
      pattern: '0 0 * * *', // Cron: midnight UTC
    },
  }
);

export const snapshotWorker = new Worker(
  'daily-snapshot',
  async (job) => {
    console.log('Running daily snapshot...');
    
    // 1. Fetch all delegator data from Coreum
    // 2. Create snapshots in DB
    // 3. Calculate daily scores
    // 4. Update classes
    // 5. Update leaderboard
    // 6. Clear caches
    // 7. Send notifications (optional)
    
    await runDailySnapshot();
    await calculateDailyScores();
    await updateClasses();
    await updateLeaderboard();
    await clearRaceCaches();
  },
  { connection: redis }
);
```

---

## 8. Frontend Components

### 8.1 Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── community/
│   │   ├── validator/
│   │   ├── institutional/
│   │   ├── tokenomics/
│   │   └── white-paper/
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard layout with wallet
│   │   ├── vault/
│   │   ├── sloth-race/
│   │   │   ├── page.tsx               # Leaderboard
│   │   │   └── [address]/page.tsx     # Profile
│   │   └── admin/
│   └── api/
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── wallet/
│   │   ├── WalletProvider.tsx
│   │   ├── ConnectButton.tsx
│   │   └── WalletModal.tsx
│   ├── race/
│   │   ├── Leaderboard.tsx
│   │   ├── SlothProfile.tsx
│   │   ├── SlothCard.tsx
│   │   ├── ClassBadge.tsx
│   │   ├── BoostBadge.tsx
│   │   └── ScoreBreakdown.tsx
│   ├── vault/
│   │   ├── VaultStats.tsx
│   │   ├── DistributionChart.tsx
│   │   └── EligibilityChecker.tsx
│   └── validator/
│       ├── ValidatorStats.tsx
│       └── DelegatorList.tsx
│
├── hooks/
│   ├── useWallet.ts
│   ├── useCoreum.ts
│   ├── useSlothProfile.ts
│   ├── useLeaderboard.ts
│   └── useVault.ts
│
├── lib/
│   ├── coreum/
│   │   ├── client.ts
│   │   ├── wallet.ts
│   │   └── contracts.ts
│   ├── prisma.ts
│   ├── redis.ts
│   └── utils.ts
│
├── stores/
│   ├── walletStore.ts
│   └── raceStore.ts
│
└── types/
    ├── coreum.ts
    ├── race.ts
    └── vault.ts
```

### 8.2 Wallet Context

```typescript
// components/wallet/WalletProvider.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { connectKeplr, connectLeapWallet } from '@/lib/coreum/wallet';
import { CoreumClient } from '@/lib/coreum/client';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (walletType: 'keplr' | 'leap') => Promise<void>;
  disconnect: () => void;
  delegation: DelegationInfo | null;
  refreshDelegation: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [delegation, setDelegation] = useState<DelegationInfo | null>(null);

  const connect = useCallback(async (walletType: 'keplr' | 'leap') => {
    setIsConnecting(true);
    try {
      const { address } = walletType === 'keplr' 
        ? await connectKeplr() 
        : await connectLeapWallet();
      
      setAddress(address);
      
      // Record connection for site visit tracking
      await fetch('/api/race/site-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      
      // Fetch delegation info
      await refreshDelegation(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setDelegation(null);
  }, []);

  const refreshDelegation = useCallback(async (addr?: string) => {
    const targetAddress = addr || address;
    if (!targetAddress) return;
    
    const client = new CoreumClient();
    const del = await client.getDelegation(targetAddress);
    setDelegation(del);
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        delegation,
        refreshDelegation,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
```

---

## 9. Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Coreezy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ env.VERCEL_ORG_ID }}
          vercel-project-id: ${{ env.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ env.VERCEL_ORG_ID }}
          vercel-project-id: ${{ env.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-contracts:
    needs: test
    if: github.ref == 'refs/heads/main' && contains(github.event.head_commit.message, '[deploy-contracts]')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      - name: Build contracts
        run: |
          cd contracts
          cargo build --release --target wasm32-unknown-unknown
      - name: Optimize contracts
        run: |
          docker run --rm -v "$(pwd)/contracts":/code \
            cosmwasm/rust-optimizer:0.14.0
      # Deploy step would require secure key management
```

---

## 10. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:pass@host:5432/coreezy?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Coreum
COREUM_NETWORK="mainnet"  # or "testnet"
COREUM_RPC="https://full-node.mainnet-1.coreum.dev:26657"
COREUM_REST="https://full-node.mainnet-1.coreum.dev:1317"
COREEZY_VALIDATOR="corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh"

# Smart Contracts (after deployment)
VAULT_CONTRACT_ADDRESS=""
RACE_CONTRACT_ADDRESS=""
REWARDS_CONTRACT_ADDRESS=""

# Auth
JWT_SECRET="your-jwt-secret"
ADMIN_ADDRESSES="core1xxx,core1yyy"

# External
NEXT_PUBLIC_APP_URL="https://coreezy.xyz"
```

---

## 11. Testing Strategy

### Unit Tests
- Smart contract logic (Rust tests)
- Scoring calculations
- Class determination
- API route handlers

### Integration Tests
- Wallet connection flows
- Snapshot job execution
- Contract interactions
- Database operations

### E2E Tests
- Full user journey (connect → delegate → race → rewards)
- Admin workflows
- Institutional inquiry flow

```typescript
// __tests__/scoring.test.ts
import { calculateDailyScore, determineClass } from '@/lib/race/scoring';

describe('Scoring System', () => {
  it('caps delegation at configured limit', () => {
    const config = { delegationCap: 50000n * 10n ** 6n };
    const snapshot = { delegationAmount: 100000n * 10n ** 6n };
    
    const score = calculateDailyScore(config, snapshot, defaultProfile);
    
    // Score should be based on 50k, not 100k
    expect(score).toBeLessThanOrEqual(config.delegationCap);
  });

  it('applies restake multiplier correctly', () => {
    const config = { restakeMultiplier: 10 }; // 10%
    const snapshotWithRestake = { ...baseSnapshot, restakeActive: true };
    const snapshotWithoutRestake = { ...baseSnapshot, restakeActive: false };
    
    const scoreWith = calculateDailyScore(config, snapshotWithRestake, defaultProfile);
    const scoreWithout = calculateDailyScore(config, snapshotWithoutRestake, defaultProfile);
    
    expect(scoreWith).toBe(scoreWithout * 110n / 100n);
  });

  it('returns zero for sleeping sloths', () => {
    const profile = { ...defaultProfile, isSleeping: true };
    
    const score = calculateDailyScore(defaultConfig, baseSnapshot, profile);
    
    expect(score).toBe(0n);
  });

  it('assigns correct class based on percentile', () => {
    expect(determineClass(10)).toBe('ADULT');
    expect(determineClass(33)).toBe('ADULT');
    expect(determineClass(34)).toBe('TEEN');
    expect(determineClass(66)).toBe('TEEN');
    expect(determineClass(67)).toBe('BABY');
    expect(determineClass(100)).toBe('BABY');
  });
});
```

---

## 12. Security Considerations

### Smart Contract Security
- [ ] Full audit before mainnet deployment
- [ ] Multi-sig admin controls
- [ ] Timelock on critical functions
- [ ] Emergency pause functionality
- [ ] Upgrade path via proxy pattern

### API Security
- [ ] Rate limiting per wallet/IP
- [ ] Signature verification for sensitive actions
- [ ] Input validation and sanitization
- [ ] Admin route protection

### Frontend Security
- [ ] CSP headers
- [ ] No private keys in client
- [ ] Read-only wallet connection by default
- [ ] Transaction simulation before signing

---

## 13. Monitoring & Observability

- **Uptime**: Vercel/Railway built-in
- **Errors**: Sentry integration
- **Analytics**: Plausible (privacy-friendly)
- **Chain Monitoring**: Custom alerts for validator status
- **Job Monitoring**: BullMQ dashboard

---

**Next Steps:**
1. Initialize project with `pnpm create next-app`
2. Set up database and Prisma schema
3. Implement Coreum client library
4. Build smart contracts (start with testnet)
5. Create core API routes
6. Build frontend components
7. Integration testing
8. Testnet deployment
9. Audit
10. Mainnet launch
