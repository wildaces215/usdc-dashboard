# Morpho USDC Vault Yields

A live dashboard for USDC-denominated Morpho vault yields on Ethereum and Base.

Built with React 19, TypeScript, Vite, TanStack React Query, Recharts, and Tailwind CSS v4.

## Features

- 📊 **Live net APY** across all listed USDC Morpho vaults (auto-refreshes every 60s)
- 🏷️ **KPI cards** — best net APY, total USDC TVL, and average net APY
- 🔗 **Chain filtering** — Ethereum mainnet, Base, or all
- 📈 **Interactive APY history charts** — 30D / 90D toggle per vault
- ↕️ **Sortable table** — by name, net APY, rewards APR, or TVL
- 📋 **Expandable rows** — detailed vault info including fees, rewards breakdown, and address

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 |
| Build | Vite 8 |
| Language | TypeScript 6 |
| Data fetching | TanStack React Query 5 + graphql-request |
| Charts | Recharts 3 |
| Styling | Tailwind CSS v4 |
| Linting | Oxlint |

Data is sourced from the [public Morpho GraphQL API](https://api.morpho.org/graphql) — no API key required.

## Getting Started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview production build
```

## Disclaimer

Data from the public Morpho GraphQL API. Read-only — not financial advice.