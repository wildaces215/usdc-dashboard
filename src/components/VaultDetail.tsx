import { useState } from 'react'
import type { MorphoVault } from '../types/morpho'
import { useVaultHistory } from '../hooks/useVaultHistory'
import { ApyChart } from './ApyChart'
import { ChainBadge } from './ChainBadge'
import { formatApy, formatFee, formatUsdFull, shortAddress, totalRewardApr } from '../lib/format'

interface Props {
  vault: MorphoVault
}

export function VaultDetail({ vault }: Props) {
  const [days, setDays] = useState<30 | 90>(30)
  const { data, isLoading } = useVaultHistory({
    address: vault.address,
    chainId: vault.chain.id,
    days,
  })

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/60 px-4 py-5 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-300">Net APY history</h4>
            <div className="flex gap-1 rounded-lg bg-zinc-900 p-0.5">
              {([30, 90] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    days === d
                      ? 'bg-zinc-700 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
          <ApyChart points={data ?? []} loading={isLoading} />
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <DetailRow label="Chain" value={<ChainBadge chainId={vault.chain.id} network={vault.chain.network} />} />
            <DetailRow label="Asset" value={vault.asset.symbol} />
            <DetailRow label="Total assets" value={formatUsdFull(vault.totalAssetsUsd)} />
            <DetailRow label="Net APY" value={formatApy(vault.netApy)} mono />
            <DetailRow label="Avg net APY" value={formatApy(vault.avgNetApy)} mono />
            <DetailRow
              label="Rewards APR"
              value={formatApy(totalRewardApr(vault.rewards) || null)}
              mono
            />
            <DetailRow label="Performance fee" value={formatFee(vault.performanceFee)} mono />
            <DetailRow label="Management fee" value={formatFee(vault.managementFee)} mono />
            <DetailRow label="Address" value={shortAddress(vault.address)} mono />
          </div>

          {vault.rewards.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-zinc-300">Rewards</h4>
              <ul className="space-y-1">
                {vault.rewards.map((r, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{r.asset.symbol}</span>
                    <span className="tabular-nums text-zinc-300">
                      {formatApy(r.supplyApr ?? null)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className={`mt-0.5 text-zinc-200 ${mono ? 'tabular-nums' : ''}`}>{value}</dd>
    </div>
  )
}