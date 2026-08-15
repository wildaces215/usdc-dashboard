// Types matching the Morpho GraphQL API (api.morpho.org/graphql) responses.
// Verified against the live schema; fields are nullable where the API may omit them.

export interface MorphoChain {
  id: number
  network: string // e.g. "mainnet", "base"
}

export interface MorphoAsset {
  symbol: string
  address: string
  decimals: number
}

export interface MorphoReward {
  asset: { symbol: string }
  supplyApr: number | null
}

export interface MorphoVault {
  address: string
  name: string
  symbol: string
  chain: MorphoChain
  asset: MorphoAsset
  totalAssetsUsd: number | null
  sharePrice: string | null
  avgNetApy: number | null
  avgNetApyExcludingRewards: number | null
  netApy: number | null
  netApyExcludingRewards: number | null
  apy: number | null
  performanceFee: number | null
  managementFee: number | null
  rewards: MorphoReward[]
}

export interface ApyPoint {
  x: number // unix seconds
  y: number // net APY as a decimal (0.041 => 4.1%)
}

export interface VaultHistory {
  address: string
  name: string
  historicalState: {
    avgNetApy: ApyPoint[]
  }
}