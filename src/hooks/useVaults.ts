import { useQuery } from '@tanstack/react-query'
import { morphoClient } from '../api/morphoClient'
import { VAULT_LIST_QUERY } from '../api/queries'
import type { MorphoVault } from '../types/morpho'

// Morpho chains we surface: Ethereum mainnet (1) and Base (8453).
export const USDC_CHAIN_IDS = [1, 8453] as const

interface VaultListResponse {
  vaultV2s: { items: MorphoVault[] }
}

export function useVaults() {
  return useQuery<MorphoVault[]>({
    queryKey: ['vaults', USDC_CHAIN_IDS],
    queryFn: async () => {
      const data = await morphoClient.request<VaultListResponse>(VAULT_LIST_QUERY, {
        chainIdIn: [...USDC_CHAIN_IDS],
        // 250 comfortably covers all listed vaults on both chains (~134) while
        // staying under Morpho's GraphQL complexity limit with the trimmed field set.
        first: 250,
      })
      // Filter to USDC-denominated vaults client-side — the API filters by
      // asset address, not symbol, so we filter here for robustness.
      return data.vaultV2s.items.filter((v) => v.asset.symbol === 'USDC')
    },
  })
}