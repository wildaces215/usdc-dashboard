import { Fragment } from 'react'
import type { MorphoVault } from '../types/morpho'
import { ChainBadge } from './ChainBadge'
import { VaultDetail } from './VaultDetail'
import {
  formatApy,
  formatFee,
  formatUsd,
  shortAddress,
  totalRewardApr,
} from '../lib/format'

export type SortKey = 'netApy' | 'totalAssetsUsd' | 'rewards' | 'name'
export type ChainFilter = 'all' | 1 | 8453

interface Props {
  vaults: MorphoVault[]
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  expanded: string | null
  onToggle: (address: string) => void
}

const COLUMNS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'name', label: 'Vault', align: 'left' },
  { key: 'netApy', label: 'Net APY', align: 'right' },
  { key: 'rewards', label: 'Rewards APR', align: 'right' },
  { key: 'totalAssetsUsd', label: 'TVL', align: 'right' },
]

export function VaultTable({
  vaults,
  sortKey,
  sortDir,
  onSort,
  expanded,
  onToggle,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/30">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                <button
                  onClick={() => onSort(col.key)}
                  className={`inline-flex items-center gap-1 hover:text-zinc-300 ${
                    col.align === 'right' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {col.label}
                  <SortArrow active={sortKey === col.key} dir={sortDir} />
                </button>
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Perf / Mgmt</th>
          </tr>
        </thead>
        <tbody>
          {vaults.map((v) => {
            const isOpen = expanded === v.address
            return (
              <Fragment key={`${v.chain.id}-${v.address}`}>
                <tr
                  onClick={() => onToggle(v.address)}
                  className={`cursor-pointer border-b border-zinc-800 transition-colors hover:bg-zinc-800/30 ${
                    isOpen ? 'bg-zinc-800/20' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-zinc-600 transition-transform ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      >
                        ›
                      </span>
                      <div>
                        <div className="font-medium text-zinc-100">{v.name}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <ChainBadge chainId={v.chain.id} network={v.chain.network} />
                          <span className="font-mono text-xs text-zinc-500">
                            {shortAddress(v.address)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-400">
                    {formatApy(v.netApy)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-400">
                    {formatApy(totalRewardApr(v.rewards) || null)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                    {formatUsd(v.totalAssetsUsd)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-500">
                    {formatFee(v.performanceFee)} / {formatFee(v.managementFee)}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <VaultDetail vault={v} />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SortArrow({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span className="text-zinc-700">↕</span>
  return <span className="text-emerald-400">{dir === 'desc' ? '↓' : '↑'}</span>
}