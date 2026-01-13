# Coreezy

A community hub built on Coreum with full blockchain integration, smart contract automation, and gamified engagement through the Sloth Race.

**Stake. Vibe. Grow. Repeat.**

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
pnpm db:generate

# Push database schema (development)
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) - Full Technical Specification

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+, TypeScript, Tailwind CSS |
| State | Zustand, TanStack Query |
| Backend | Next.js API Routes, Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Jobs | BullMQ |
| Blockchain | CosmJS, Coreum |
| Contracts | CosmWasm (Rust) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── layout/            # Header, Footer, Navigation
│   ├── wallet/            # Wallet connection components
│   ├── race/              # Sloth Race components
│   └── ui/                # Shared UI components
├── config/                 # Configuration files
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and clients
│   ├── coreum/            # Coreum blockchain client
│   ├── prisma.ts          # Database client
│   └── redis.ts           # Cache client
├── stores/                 # Zustand stores
└── types/                  # TypeScript types
```

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://localhost:6379"

# Coreum
COREUM_NETWORK="mainnet"
COREUM_RPC="https://full-node.mainnet-1.coreum.dev:26657"
COREUM_REST="https://full-node.mainnet-1.coreum.dev:1317"
COREEZY_VALIDATOR="corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh"

# Smart Contracts (after deployment)
VAULT_CONTRACT_ADDRESS=""
RACE_CONTRACT_ADDRESS=""

# Auth
JWT_SECRET="your-secret"
ADMIN_ADDRESSES="core1xxx,core1yyy"

# App
NEXT_PUBLIC_APP_URL="https://coreezy.xyz"
```

## Development

### Database

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Push schema to database (dev only)
pnpm db:push

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

### Smart Contracts

See [contracts/README.md](./contracts/README.md) for smart contract development instructions.

```bash
# Build contracts
cd contracts
cargo build --release --target wasm32-unknown-unknown

# Deploy to testnet
cored tx wasm store artifacts/coreezy_vault.wasm --from deployer --chain-id coreum-testnet-1
```

## Key Features

### Sloth Race

Gamified delegation tracking with:
- Daily snapshots
- Capped delegation scoring
- Restake multipliers
- Social proof boosts
- Dynamic class system (Baby/Teen/Adult)

### Vault Mechanics

Automated reward distribution:
- 50% Reinvestment (initial) / 50% Drip (final)
- 10% Marketing/Dev
- 40% OG NFT Rewards (initial) / 20% (final)

### Validator

Enterprise-grade infrastructure:
- Zeeve managed services
- Multi-region deployment
- 2% commission
- 24/7 monitoring

## License

© 2025 Coreezy Vibes LLC. All rights reserved.
