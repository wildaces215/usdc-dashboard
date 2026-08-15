import { useQuery } from '@tanstack/react-query'
import { morphoClient } from '../api/morphoClient'
import { VAULT_HISTORY_QUERY } from '../api/queries'
import type { ApyPoint, VaultHistory } from '../types/morpho'

interface HistoryResponse {
  vaultV2ByAddress: VaultHistory | null
}

interface Args {
  address: string
  chainId: number
  days: number
}

const DAY = 86_400

export function useVaultHistory({ address, chainId, days }: Args) {
  return useQuery<ApyPoint[]>({
    queryKey: ['vaultHistory', chainId, address, days],
    enabled: !!address,
    queryFn: async () => {
      const endTimestamp = Math.floor(Date.now() / 1000)
      const startTimestamp = endTimestamp - days * DAY
      const data = await morphoClient.request<HistoryResponse>(VAULT_HISTORY_QUERY, {
        address,
        chainId,
        options: { startTimestamp, endTimestamp, interval: 'DAY' },
      })
      const points = data.vaultV2ByAddress?.historicalState?.avgNetApy ?? []
      // API returns points newest-first; sort ascending for the chart.
      return [...points].sort((a, b) => a.x - b.x)
    },
    // History changes slowly; refresh less often than the live list.
    refetchInterval: 5 * 60_000,
    staleTime: 5 * 60_000,
  })
}