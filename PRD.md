# Coreezy Website Rebuild
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** January 12, 2026  
**Project:** Coreezy.xyz Redesign  

---

## 1. Executive Summary

Coreezy is a community-driven lifestyle brand and validator service built on Coreum, with expansion into XRP Ledger. The current WordPress site serves basic informational needs but lacks the structure, engagement features, and dual-audience appeal required for both community growth and institutional credibility.

This PRD outlines a complete rebuild targeting:
- **Community engagement** through gamification (Sloth Race)
- **Institutional credibility** through professional validator presentation
- **Revenue generation** through NFT integration and partner ecosystem
- **SEO and traffic growth** through shareable content and social integration

---

## 2. Target Audiences

### Primary: Community Members (Retail)
- COREZ token holders
- Coreum/XRP delegators
- NFT collectors
- Meme culture participants
- Long-term stakers seeking steady growth

### Secondary: Institutional Partners
- Crypto funds and allocators
- Other validators seeking partnerships
- Protocol foundations
- Enterprise staking services
- Compliance-focused institutional delegators

---

## 3. Core Brand Identity

### Tagline
> "Stake. Vibe. Grow. Repeat."

### Tone
- Calm, patient, unhurried
- Anti-hype, anti-pump culture
- Community-first
- Transparent and honest
- Sloth mascot embodies patience and purpose

### Visual Direction
- No generic "AI slop" aesthetic
- Nature-inspired (jungle canopy, hammocks)
- Warm earth tones with accent colors
- Sloth character variations
- Clean, readable typography

---

## 4. Site Architecture

```
coreezy.xyz/
├── Home (/)
├── Community
│   ├── Overview (/community)
│   ├── Sloth Race Dashboard (/sloth-race)
│   ├── Partner Projects (/partners)
│   └── FAQ (/faq)
├── Validator
│   ├── Overview (/validator)
│   └── Institutional (/institutional)
├── NFTs
│   ├── OG Collection (/og-nfts)
│   └── Canopy Collection (/canopy-collection)
├── Tokenomics (/tokenomics)
├── Vault Dashboard (/vault)
├── Education (/learn)
├── White Paper (/white-paper)
└── Contact (/contact)
```

---

## 5. Feature Specifications

### 5.1 Homepage

**Above the Fold**
- Clear headline: "Reliable Coreum Validation Infrastructure for Communities and Institutions"
- Subheadline: "Enterprise-grade uptime, transparent operations, community-aligned incentives"
- Two primary CTAs:
  - "Stake with Coreezy" → validator page
  - "Join the Community" → community overview
- Trust signals strip:
  - Uptime percentage
  - Total stake secured
  - Active delegators count
  - Infrastructure provider (Zeeve)
  - Commission rate (2%)

**Section 2: Who Coreezy Is For**
Split-screen layout:

| Community | Institutions |
|-----------|-------------|
| Fair rewards | Jurisdiction-aware operations |
| Transparent distributions | Redundancy and failover |
| Partner project support | Capital protection mindset |
| NFT access and perks | Documented governance |

**Section 3: Why Trust Coreezy**
- Enterprise-grade infrastructure (Zeeve)
- Dedicated slashing reserve
- Documented incident response
- Public metrics and disclosures
- No hidden delegation logic

**Section 4: Ecosystem Overview**
- COREZ token purpose
- NFT collections
- Validator rewards
- Partner ecosystem
- Vault mechanics preview

**Footer**
- Docs, Governance, Risk Disclosures, Contact, Legal
- Validator address links
- Social links

---

### 5.2 Sloth Race Dashboard (Core Gamification Feature)

**Purpose:** Increase engagement, site visits, and social sharing through a gamified delegation tracking system.

**Core Mechanics:**

#### Daily Scoring
```
Daily Score = 
  Capped Delegation Score
  × Restake Multiplier
  × Activity Multiplier
  × Engagement Bonus (binary)
```

#### Delegation Scoring
- Delegation weighted, but capped (suggested: 50k COREUM max effect)
- Prevents whale dominance while respecting larger delegators
- Net delegation changes tracked daily

#### Restake Multiplier
- Auto-restake enabled = +X% daily multiplier
- Turning off restake resets streak
- Visible streak counter on profile

#### Undelegation Penalty
- Any undelegation = "Sloth sleeps" for N days
- No points during sleep period
- Recovery requires re-delegation + waiting period

#### Site Engagement Bonus
- Binary daily bonus (connected or not)
- Requires wallet connection
- Page interaction required (scroll, click)
- +1-2% daily multiplier, not stackable

#### Social Proof Boosts
- Submit proof of social post (X, TikTok, Instagram, Reddit)
- Manual/semi-manual approval
- +5% boost for 24-48 hours
- Max 1 boost per platform per week
- Hard cap: +15% max active at any time

**Sloth Classes (Dynamic Percentile-Based)**

| Class | Percentile | Narrative |
|-------|-----------|-----------|
| Adult Sloths | Top 33% | Calm dominance, long-term holders |
| Teen Sloths | Middle 33% | Building habits, competing |
| Baby Sloths | Bottom 33% | Just arrived, learning |

- Classes recalculated daily based on Effective Delegation Score
- Changes apply next day (no whiplash)
- Separate reward pools per class (40%/35%/25%)

**Sloth Profile Pages**
- Individual shareable URLs: `coreezy.xyz/sloth/[wallet]`
- Displays:
  - Sloth name (customizable?)
  - Current class
  - Race position
  - Active boosts
  - Restake streak
  - "Days awake" counter
  - Delegation tier badge
- SEO-indexable
- Share-ready visuals/badges

---

### 5.3 Validator Page (Community-Facing)

**Current content preserved with enhancements:**

- Operator: Coreezy Vibes LLC (Wyoming, USA)
- Infrastructure: Zeeve enterprise services
- Multi-region cloud deployment
- 24/7 monitoring
- 2% commission rate

**On-Chain Links:**
- Mintscan validator metrics
- Coreum Explorer status

**Trust Elements:**
- Slashing policy summary
- Governance participation history
- Self-delegation commitment

---

### 5.4 Institutional Page

**Separate from community content. No sloths, no memes.**

**Sections:**
1. What Coreezy Provides
2. Infrastructure & Redundancy
3. Governance & Controls
4. Risk & Slashing Management
5. Jurisdiction & Operations
6. Contact / NDA Discussion

**Key Messaging:**
- "This page provides a public, protocol-level overview of Coreezy's validator operations. Detailed operational procedures, governance thresholds, and incident response controls are available to institutional participants upon engagement."

**Gated Content (Available Under NDA):**
- Full incident response playbook
- Reserve policy with figures
- Wallet mappings
- Internal governance procedures
- Legal memos

---

### 5.5 Vault Dashboard

**Real-time or near-real-time display of:**
- Total vault value (COREUM)
- COREZ holdings in vault
- Staking rewards accrued
- Distribution history
- Conversion progress (toward 1.5M COREUM goal)

**Distribution Visualization:**
Initial Phase:
- 50% Reinvestment
- 10% Marketing/Dev
- 40% OG NFT Rewards

Final Phase:
- 50% Buyback/Reward Drip
- 15% Reinvestment
- 10% Marketing/Dev
- 20% OG NFT Pool (+ 5% future NFTs)

---

### 5.6 NFT Sections

**OG Collection**
- 100 pieces
- Perpetual 20% vault rewards access
- Cultural status proof
- Link to Bidds marketplace

**Canopy Collection (XRPL)**
- 1,000 hand-drawn pieces
- Cross-chain expansion
- 7 XRP whitelist / 9 XRP public mint
- Artist: EliyamTheThird
- Revenue flow:
  - 2 XRP per NFT to artist
  - Remainder → Coreum staking
  - 20% restaked, 80% → COREZ for FARM + Money Grabbers

---

### 5.7 Tokenomics Page

**COREZ Token Details:**
- Fixed supply: 10,000,000
- Fair launch (no team allocations)
- Ticker: $COREZ

**Distribution:**
- 10% → Vault staking reserve
- 3% → Marketing/Dev wallet
- 2.02% → Founder purchase (during fair launch)

**Utility:**
- Community passport
- NFT drop eligibility
- Validator reward access
- Partner perks
- Future 1.5M COREUM vault unlock

---

### 5.8 Education Section

**Video Embeds:**
- Coreum in 2 Minutes series (Ep. 1-11 by @artikyoul8)
- Host on OmniFlix

**Expandable Guides:**
- "What is restaking?"
- "How the Sloth Race works"
- "Why undelegation pauses your sloth"
- "Understanding validator rewards"

---

## 6. Technical Requirements

> **See [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) for full implementation details including smart contract code, database schema, and API architecture.**

### 6.1 Build Approach

**This is a ground-up build** - no WordPress, no existing codebase. Full custom implementation with:

- **Custom Next.js 14+ application**
- **Full Coreum blockchain integration via CosmJS**
- **Smart contracts (CosmWasm/Rust) for automation**
- **PostgreSQL + Redis backend**

### 6.2 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14+, TypeScript, Tailwind | UI/UX |
| State | Zustand, TanStack Query | Client state & caching |
| Backend | Next.js API Routes, Prisma | API & ORM |
| Database | PostgreSQL | Primary data store |
| Cache | Redis | Sessions, rate limiting, leaderboard cache |
| Jobs | BullMQ | Daily snapshots, scoring |
| Blockchain | CosmJS, coreum-wasm-sdk | Coreum integration |
| Contracts | CosmWasm (Rust) | On-chain automation |
| Hosting | Vercel + Railway | Frontend + backend services |

### 6.3 Smart Contracts (CosmWasm)

Three primary contracts deployed on Coreum:

| Contract | Purpose |
|----------|---------|
| `coreezy-vault` | Vault deposits, reward distribution automation |
| `coreezy-race` | On-chain scoring, snapshots, leaderboard |
| `coreezy-rewards` | Automated distribution to delegators/NFT holders |

**Automation Capabilities:**
- Automatic reward distribution based on vault mechanics
- On-chain class calculations
- Transparent, verifiable scoring
- Admin multi-sig controls with timelock

### 6.4 Coreum Integration

**Network:**
- Mainnet: `coreum-mainnet-1`
- RPC: `https://full-node.mainnet-1.coreum.dev:26657`
- REST: `https://full-node.mainnet-1.coreum.dev:1317`

**Validator Address:**
`corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh`

**Key Queries:**
- Validator delegations
- Individual delegation amounts
- Staking rewards
- Governance participation

### 6.5 Wallet Integration

**Supported Wallets:**
- Leap Wallet (primary)
- Keplr
- WalletConnect 2.0

**Connection Flow:**
1. User clicks "Connect Wallet"
2. Wallet selection modal
3. Chain suggestion (if not added)
4. Signature request for auth
5. Session creation
6. Site visit recorded for race scoring

### 6.6 Data Architecture

**Daily Snapshot Job (00:00 UTC):**
```
1. Query all delegators from Coreum
2. Compare to previous day's snapshot
3. Calculate net changes
4. Check restake status
5. Apply undelegation penalties
6. Store snapshot in DB
7. Calculate daily scores
8. Update class assignments
9. Rebuild leaderboard cache
10. Clear stale caches
```

**Race Score Formula:**
```
Daily Score = 
  min(delegation, cap) 
  × (1 + restake_bonus) 
  × (1 + site_visit_bonus) 
  × (1 + active_boosts)
```

---

## 7. SEO Strategy

### Indexable Pages
- Individual sloth profile pages
- `/sloth-race` leaderboard
- `/sloth-classes` explanation
- Educational content pages
- White paper

### Structured Data
- Dynamic timestamps
- Unique content per profile
- Race statistics updates

### Dwell Time Optimization
- Expandable educational sections
- Interactive dashboard elements
- Video content

### Backlink Strategy
- Shareable race cards/badges
- Social proof boost submissions
- Partner project cross-links

---

## 8. Social Integration

### Share-Ready Assets
- Auto-generated race cards
- Class badges
- Boost banners
- One-click download

### Weekly Hype Events
- "Sunday Sloth Sprint"
- "Midweek Wake-Up Boost"
- "Final 72-hour Frenzy"

### Post Requirements for Boosts
- Must include sloth race visual
- Coreezy name or URL
- Race context
- Low effort memes acceptable, spam not

---

## 9. Revenue Streams

### Current
- Validator commission (2%)
- NFT sales (OG, Canopy)
- Merch (Calco hats)

### Future Opportunities
1. **Sponsored Events** - Partner projects sponsor time-bound race events
2. **Premium Analytics** - Subscription or NFT-gated advanced stats
3. **Validator Consulting** - Services for other projects
4. **Dashboard Builds** - White-label community tools

---

## 10. Compliance & Legal

### Disclaimers Required
- "Educational and entertainment purposes only"
- "Not financial advice"
- "Cryptocurrency investments are volatile"
- "Past performance not indicative"
- "Not registered financial advisors"

### Entity
- Coreezy Vibes LLC (Wyoming, USA)

### Key Points
- COREZ is not an investment
- Vault rewards are community milestone incentives, not dividends
- No custody of user funds
- No guaranteed returns or uptime

---

## 11. Success Metrics

### Engagement
- Daily active wallets connected
- Average session duration
- Return visit rate
- Social boost submissions

### Growth
- Total delegators
- Total stake secured
- NFT holders
- COREZ holder count

### SEO
- Organic search traffic
- Branded search volume ("Coreezy sloth race")
- Backlink acquisition
- Page index count

### Revenue
- Validator reward growth
- NFT sales volume
- Partner applications

---

## 12. Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Design system and brand guidelines
- [ ] Homepage rebuild
- [ ] Validator page (community + institutional)
- [ ] Basic wallet connection
- [ ] Vault dashboard (read-only)

### Phase 2: Gamification (Weeks 5-8)
- [ ] Daily snapshot infrastructure
- [ ] Sloth Race scoring system
- [ ] Class system implementation
- [ ] Individual profile pages
- [ ] Leaderboard

### Phase 3: Social & Engagement (Weeks 9-12)
- [ ] Social boost submission system
- [ ] Share asset generation
- [ ] Weekly event framework
- [ ] Push/email notifications (opt-in)

### Phase 4: Polish & Growth (Weeks 13-16)
- [ ] Premium features
- [ ] Partner dashboard
- [ ] Advanced analytics
- [ ] SEO optimization
- [ ] Performance tuning

---

## 13. Open Questions

1. **Delegation cap threshold** - 25k, 50k, or 100k COREUM?
2. **Social boost approval** - Manual review or automated with flagging?
3. **Class reward splits** - Confirm 40/35/25 distribution
4. **Sloth naming** - User-customizable or auto-generated?
5. **Institutional inquiry workflow** - Form vs direct email vs NDA process?
6. **Partner project display** - Current partners: Farmer Union, Black Market Dawgs, Money Grabs, ChainPlate, XMEME - expand?

---

## 14. Appendix

### Current Site Assets to Preserve
- Sloth imagery and mascot
- Educational video links (OmniFlix)
- Partner logos
- White paper content
- Validator transparency text
- Legal disclaimers

### Partner Links
- Farmer Union: https://farmerunion.meme/
- Black Market Dawgs: https://www.blackmarketdawgs.com/
- Money Grabs: https://x.com/TheMoneyGrabs
- ChainPlate: https://chainplate.app
- XMEME: https://www.xmemecoinxrpl.com/

### External Links
- Mintscan: https://www.mintscan.io/coreum/validators/corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh/
- Coreum Explorer: https://explorer.coreum.com/coreum/validators/corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh
- OG NFT Collection: https://bidds.com/collection/coreezy-vibes-og-nfts/
- Buy COREZ: https://app.cruise-control.xyz/trade/core1ppuayqt2t0chjkt9jemtyr4v2tl2krqcpjc6ed2yzl9kx75gvwzqquenfg
- Leap Wallet: https://www.leapwallet.io
- X/Twitter: https://x.com/CoreezyVibes
- Telegram: https://t.me/+hh333N0pTRFjNjIx

---

**Document prepared for Coreezy Vibes LLC**  
**Contact:** andrew@coreezy.xyz
