# RapidPay — Modern Online Banking App (Next.js, Prisma, PostgreSQL)

> A clean, modern “online banking” demo with on‑ramp deposits, P2P transfers, balances, and transaction history — built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![Auth](https://img.shields.io/badge/Auth-NextAuth.js-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Table of Contents
- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Data Model (ERD)](#data-model-erd)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Core Flows](#core-flows)
- [API Reference](#api-reference)
- [UI & Styling](#ui--styling)
- [Accessibility & Performance](#accessibility--performance)
- [Testing](#testing)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Repo Visibility (Private/Public)](#repo-visibility-privatepublic)

---

## Overview
**RapidPay** is a full‑stack banking demo that mirrors real‑world money app flows:
- Add money (on‑ramp) via supported providers
- Peer‑to‑Peer transfers by **recipient name**
- Live balance with locked amounts for in‑flight operations
- Transaction history with statuses

The app is responsive across all screen sizes and uses a clean, minimal design.

---

## Screenshots

> Replace these with real screenshots when ready. Files live under `public/readme/`.

![Dashboard](./public/readme/dashboard.png)
![Transfer](./public/readme/transfer.png)
![Transactions](./public/readme/transactions.png)

---

## Features
- 🔐 **Auth**: NextAuth (GitHub OAuth; email/password optional)
- 🏦 **Balance & Locking**: Safe updates with Prisma transactions
- 💳 **On‑Ramp**: Start → processing → success/failure statuses
- 🔁 **P2P Transfers**: Send money using recipient **name** (unique constraint recommended)
- 📜 **Transactions**: On‑ramp + P2P history
- 🧱 **Components**: Top bar (session‑aware), Sidebar (Home/Transfer/Transactions), Balance card, Transfer form, OnRampTransaction card
- 📱 **Responsive**: Mobile‑first layout

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: NextAuth.js (GitHub provider configured)
- **ORM & DB**: Prisma + PostgreSQL
- **Runtime**: Node.js 18+

---

## System Architecture
- **Client** renders pages/components → calls **/api** routes
- **API** routes validate input & call **services** in `/lib/actions`
- **Services** use **Prisma** to read/write PostgreSQL within **transactions**
- **NextAuth** manages session & providers
- **UI** reads server data via server components/server actions where appropriate

```
Client UI → Next.js API Routes → Service/Action Layer → Prisma → PostgreSQL
                           ↘ NextAuth (session & OAuth)
```

---

## Data Model (ERD)

```mermaid
erDiagram
  User ||--o{ OnrampTransaction : "has many"
  User ||--|| Balance : "has one"
  User ||--o{ P2PTransfer : "sentTransfers"
  User ||--o{ P2PTransfer : "receivedTransfers"

  User {
    String id PK
    String email
    String name
    String number
    String password
  }

  Balance {
    String id PK
    String userId FK
    Int amount
    Int locked
  }

  OnrampTransaction {
    String id PK
    String userId FK
    String status  // success | failure | processing
    String token
    String provider
    Int amount
    DateTime startTime
  }

  P2PTransfer {
    String id PK
    String fromUserId FK
    String toUserId FK
    Int amount
    DateTime timestamp
  }
```

---

## Project Structure

```
on/                     # repo root folder
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ auth/
│  │  ├─ sign-in/
│  │  └─ sign-up/
│  ├─ api/
│  │  ├─ home/
│  │  ├─ user/
│  │  ├─ onramp/            # e.g., start-callbacks, status webhooks (future)
│  │  └─ p2p/               # e.g., /api/p2p/transfer
│  ├─ components/
│  │  ├─ TopBar.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ BalanceCard.tsx
│  │  ├─ AddMoneyCard.tsx
│  │  └─ OnRampTransactionCard.tsx
│  └─ transfer/
│     └─ page.tsx
├─ lib/
│  ├─ auth.ts
│  ├─ prisma.ts
│  └─ actions/
│     ├─ onramp.ts
│     └─ p2p-transfer.ts
├─ prisma/
│  └─ schema.prisma
├─ public/
│  └─ readme/
│     ├─ dashboard.png
│     ├─ transfer.png
│     └─ transactions.png
├─ .env.example
├─ package.json
└─ README.md
```

---

## Environment Variables

Create `.env` from the example below:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rapidpay?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-secret"

# GitHub OAuth (if used)
GITHUB_ID="your_github_oauth_client_id"
GITHUB_SECRET="your_github_oauth_client_secret"
```

> **Note:** You already configured GitHub credentials and NextAuth secret/URL earlier.

---

## Getting Started

### 1) Prerequisites
- Node.js 18+
- pnpm / npm / yarn
- PostgreSQL 14+ (or Docker)

**Docker (recommended):**
```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    container_name: rapidpay-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rapidpay
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```
```bash
docker compose up -d
```

### 2) Install deps
```bash
pnpm install
# or npm install / yarn
```

### 3) Prisma init & migrate
```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
# Optional: pnpm prisma studio
```

> **Seeding:** You opted not to maintain a `seed.ts`. If needed later, add one under `prisma/seed.ts` and run `pnpm prisma db seed`.

### 4) Run dev
```bash
pnpm dev
# open http://localhost:3000
```

### 5) Build & start (production)
```bash
pnpm build
pnpm start
```

---

## Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

---

## Core Flows

### 1) Add Money (On‑Ramp)
- User selects a provider in **AddMoneyCard**
- Backend creates an `OnrampTransaction` with `processing` status and a `token`
- Provider/webhook (future) confirms → status becomes `success` or `failure`
- On success: increase `Balance.amount` & clear `locked` if applicable

### 2) P2P Transfer
- Inputs: **recipient name** and **amount**
- Validate sender balance (consider `locked`)
- Run a **Prisma transaction**:
  - Decrement sender `Balance.amount`
  - Increment recipient `Balance.amount`
  - Insert `P2PTransfer`
- Return updated balances

### 3) Transactions View
- List `OnrampTransaction` + `P2PTransfer`
- Outbound vs inbound styling; show amounts and timestamps

---

## API Reference

> Endpoints may change; keep this section aligned with your `/app/api` routes.

### `POST /api/onramp/start`
**Body**
```json
{ "provider": "bankX", "amount": 5000 }
```
**Response**
```json
{ "transactionId": "txn_123", "status": "processing", "token": "abc123" }
```

### `POST /api/p2p/transfer`
**Body**
```json
{ "toName": "Alice", "amount": 1200 }
```
**Response**
```json
{ "ok": true, "transferId": "tr_456", "balance": { "amount": 8800, "locked": 0 } }
```

### `GET /api/user/balance`
**Response**
```json
{ "amount": 10000, "locked": 0 }
```

---

## UI & Styling

- **Components**: TopBar (auth‑aware), Sidebar (Home/Transfer/Transactions), BalanceCard, AddMoneyCard, OnRampTransactionCard
- **Design**: Royal Blue / Silver / Light Beige  
  - `--brand-blue: #1f3aa6;`
  - `--brand-silver: #c0c7d1;`
  - `--brand-beige: #f6f1ea;`
- **Guidelines**: Minimal, accessible, responsive

---

## Accessibility & Performance
- Semantic HTML for cards, lists, and buttons
- Focus states & keyboard navigation
- Avoid large client bundles; prefer server components where possible
- Image optimization via `next/image` (if/when images exist)

---

## Testing
- **Unit**: Jest + React Testing Library (components & actions)
- **E2E**: Playwright (auth happy path, add money, P2P transfer)
- **DB**: Use a test schema or a Dockerized ephemeral Postgres in CI

*(Add configuration files as you enable tests.)*

---

## Security Notes
- Use **Prisma transactions** to prevent race conditions in balance updates
- Validate/limit amounts server‑side; never trust client input
- Protect API routes with session checks (`NextAuth`)
- Log and verify provider callbacks for on‑ramp
- Planned: **WSTG** test passes (Burp Suite Pro) for each route

---

## Roadmap
- [ ] Provider webhook endpoints for on‑ramp confirmations
- [ ] On‑ramp receipt & detailed status timeline
- [ ] Pagination & filters for transactions
- [ ] Rate‑limit transfer endpoint
- [ ] Add notifications/toasts for key actions
- [ ] CI (GitHub Actions) with lint, typecheck, and Playwright
- [ ] Dockerfile & one‑command `docker compose up`

---

## Contributing
This is a personal project. PRs are welcome for bug fixes, docs, or minor improvements.  
1) Fork → 2) Create feature branch → 3) PR with a clear description.

---

## License
**MIT** — free to use, modify, and distribute.

---

## Repo Visibility (Private/Public)
You can toggle visibility in **GitHub → Repository → Settings → Danger Zone → Change repository visibility**.  
- **Private**: Only you/collaborators can view.  
- **Public**: Visible to everyone (good for portfolio/demo).

---

