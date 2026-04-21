# Maikah Annders Finance — Phase 1 Design Spec
**Date:** 2026-04-21
**Scope:** Data Foundation
**Status:** Awaiting approval

---

## Overview

Maikah Annders Finance is a private personal finance app for Dee and Annika. It connects to their Australian bank accounts via open banking, syncs transactions automatically, and builds a clean data layer that powers all future dashboard, forecasting, and investment features.

Phase 1 delivers the data foundation only — no dashboard UI. By the end of Phase 1, all financial data is flowing, clean, categorised, and queryable. Phase 2 builds on top of it.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Consistent with existing skills |
| Database | Neon Postgres | Relational, serverless, free tier, perfect for transactions |
| ORM | Drizzle | Lightweight, type-safe, pairs well with Neon |
| Open banking | Basiq API | CDR-accredited, supports CBA + St George, Australian-native |
| Cache / rate limit | Upstash Redis | Already in toolbelt |
| Auth | NextAuth.js (single shared account) | One household login, both users share session |
| Deployment | Vercel | Consistent with existing stack |

---

## Accounts in Scope

| Bank | Account Type | Connection Method |
|---|---|---|
| CBA | Personal transaction, savings, credit card | Basiq (CDR open banking) |
| St George | Home loan | Basiq (CDR open banking) |
| ANZ | SM business | Not in Phase 1 — architecture supports adding later |

**Manual entry only (no API):**
- Super balances (Colonial First State, Aware Super — monthly update)
- Investment property ledger (rental income, expenses, mortgage interest)
- Novated lease (Annika — pre-tax, invisible in bank data)
- HECS balance (pre-tax, invisible in bank data)
- Tax liability estimate (Dee's commission-based PAYG)
- Credit card balances not held at CBA

---

## Data Model

### `accounts`
Represents each connected bank account or manual account.

```
id, user_id, basiq_account_id, institution, name, type,
current_balance, available_balance, currency, last_synced_at,
is_manual, created_at
```

Account types: `transaction`, `savings`, `credit_card`, `home_loan`, `super`, `property`, `manual`

---

### `transactions`
Every transaction from every account.

```
id, account_id, basiq_transaction_id, date, description,
amount, direction (debit/credit), category_id, merchant_id,
is_transfer, transfer_pair_id, is_manual, tags[], notes,
created_at, updated_at
```

- `is_transfer` — true when this transaction is one leg of an inter-account transfer
- `transfer_pair_id` — links the two legs so they cancel out in cashflow reporting
- `tags[]` — array: `personal`, `business`, `joint`, `one_off`

---

### `merchants`
Enriched merchant registry built over time.

```
id, raw_name, display_name, category_id, icon_url, created_at
```

Example: raw `BRANDON SHASHATI NEWIE` → display `PT — Annika`

---

### `categories`
Two-level hierarchy: group → category.

```
id, parent_id, name, colour, icon, is_system, created_at
```

System categories (cannot be deleted):
- Income → Salary, Commission, Rental Income, Other Income
- Housing → Mortgage/Rent, Utilities, Rates, Insurance, Maintenance
- Transport → Fuel, Rego, Insurance, Novated Lease, Public Transport
- Food → Groceries, Dining Out, Takeaway
- Health → Medical, Pharmacy, Gym, PT
- Personal → Clothing, Personal Care, Entertainment, Subscriptions
- Savings → Emergency Fund, Investment, Super Top-up, Sinking Funds
- Debt → Credit Card Payment, HECS, Personal Loan
- Business → SM Expenses (tagged, not mixed into personal totals)
- Transfers → Internal Transfer (excluded from cashflow)

---

### `category_rules`
Merchant-to-category mapping rules, applied automatically on sync.

```
id, pattern (regex or exact), merchant_id, category_id,
tag, priority, created_at
```

Rules applied in priority order. Last manual override always wins.

---

### `basiq_connections`
Stores Basiq OAuth tokens per connected institution.

```
id, institution, basiq_user_id, basiq_job_id,
access_token, refresh_token, expires_at, status, created_at
```

Tokens refreshed automatically before expiry. If refresh fails, connection marked `needs_reauth` and surfaced in Phase 2 UI.

---

### `manual_entries`
Periodic snapshots for data that has no API.

```
id, type (super|property|novated_lease|hecs|tax_liability),
label, amount, direction, effective_date, notes, created_at
```

---

### `goals`
Tracks financial targets.

```
id, name, target_amount, current_amount, deadline,
category, status (active|completed|paused), created_at
```

Initial goals seeded on setup:
- Emergency fund: $20,000
- CC payoff: by Month 1
- Super catch-up: $9,472 by June 30
- Annika quit date: driven by SM revenue (Phase 3)

---

## Basiq Integration

### Setup Flow (one-time)
1. Dee registers a Basiq account (sandbox → production)
2. Basiq app credentials stored as env vars: `BASIQ_API_KEY`
3. On first app load, user clicks "Connect CBA" → Basiq OAuth consent flow → CBA grants access
4. Repeat for St George
5. Basiq returns account list → stored in `accounts` table

### Ongoing Sync
- Basiq sends webhooks on new transactions → `POST /api/basiq/webhook`
- Webhook handler validates signature, fetches transaction payload, writes to `transactions`
- Fallback: daily cron job polls Basiq for last 7 days (catches missed webhooks)
- Rate limit: Upstash Redis token bucket, max 10 Basiq API calls/minute

### Webhook Handler Flow
```
Receive webhook
→ Verify Basiq signature
→ Fetch full transaction from Basiq API
→ Check for duplicate (basiq_transaction_id)
→ Run duplicate/transfer detection
→ Apply category rules
→ Enrich merchant name
→ Write to transactions table
→ Invalidate relevant Redis cache keys
```

---

## Duplicate & Transfer Detection

Inter-account transfers appear as a debit in one account and a credit in another. Without detection, they inflate both income and expenses.

**Detection logic:**
1. On each new transaction, query for a matching transaction in the opposite direction within ±1 day, same absolute amount, different account
2. If match found → mark both `is_transfer = true`, set `transfer_pair_id` on both
3. Transfers are excluded from all cashflow calculations
4. Unmatched transfers flagged for manual review

---

## Merchant Enrichment

1. On transaction write, check `merchants` table for exact `raw_name` match
2. If found → apply `display_name` and `category_id`
3. If not found → create new merchant entry with raw name, flag for enrichment
4. Enrichment queue: surfaced in UI (Phase 2) as "needs tagging" — user sets display name + category once, applies forever via rule

---

## Manual Entry Layer

Accessible via API routes from Phase 2 onwards. Phase 1 defines the schema and endpoints:

- `POST /api/manual/super` — update super balance snapshot
- `POST /api/manual/property` — log property income/expense
- `POST /api/manual/entry` — generic manual financial entry
- `GET /api/manual/summary` — all manual entries for a period

---

## API Routes (Phase 1)

| Route | Method | Purpose |
|---|---|---|
| `/api/basiq/connect` | GET | Initiate Basiq OAuth for a bank |
| `/api/basiq/callback` | GET | Handle OAuth callback, store tokens |
| `/api/basiq/webhook` | POST | Receive transaction webhooks |
| `/api/basiq/sync` | POST | Manual trigger full sync |
| `/api/accounts` | GET | List all accounts with balances |
| `/api/transactions` | GET | Query transactions (filters: account, date, category) |
| `/api/transactions/[id]` | PATCH | Update category, tags, notes |
| `/api/categories` | GET/POST | List and create categories |
| `/api/rules` | GET/POST/DELETE | Manage category rules |
| `/api/merchants` | GET/PATCH | List and enrich merchants |
| `/api/manual/entry` | POST | Create manual entry |
| `/api/manual/summary` | GET | Summary of manual entries |

---

## Auth

Single shared household account. NextAuth.js with credentials provider (email + password). No multi-user, no roles. Both Dee and Annika use the same login. Session stored in Upstash Redis.

Env vars required:
```
NEXTAUTH_SECRET
NEXTAUTH_URL
BASIQ_API_KEY
DATABASE_URL (Neon)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

---

## What Phase 1 Does NOT Include

- Any dashboard UI (Phase 2)
- Forecasting or scenario modelling (Phase 3)
- Alerts or weekly digest (Phase 3)
- Monthly close-out view (Phase 4)
- ANZ business account (future)
- Investment portfolio tracking (Phase 3)
- Insurance audit module (future)

---

## Success Criteria for Phase 1

- [ ] CBA and St George accounts connected via Basiq OAuth
- [ ] Transactions syncing automatically via webhook
- [ ] Inter-account transfers correctly detected and excluded from cashflow
- [ ] All transactions categorised (via rule or manual)
- [ ] Merchant names enriched for top 20 recurring merchants
- [ ] Manual entries working for super, property, novated lease, HECS
- [ ] All API routes returning correct data
- [ ] No duplicate transactions in database

---

## Phase 2 Preview

With Phase 1 complete, Phase 2 builds the dashboard:
- Primary metric: *Days until Annika can quit*
- Net worth snapshot
- Monthly cashflow
- Upcoming payments
- Goal progress
- Design language: Revolut meets private wealth dashboard — dark, premium, numbers that feel alive
