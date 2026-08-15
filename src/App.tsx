import { useMemo, useState } from 'react'
import { useVaults } from './hooks/useVaults'
import { VaultTable, type ChainFilter, type SortKey } from './components/VaultTable'
import { StatCard } from './components/StatCard'
import { CarbonAd } from './components/CarbonAd'
import { formatApy, formatUsd } from './lib/format'

export default function App() {
  const { data: vaults, isLoading, isError, error } = useVaults()

  const [sortKey, setSortKey] = useState<SortKey>('netApy')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [chainFilter, setChainFilter] = useState<ChainFilter>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const usdcVaults = useMemo(() => {
    if (!vaults) return []
    let list = vaults
    if (chainFilter !== 'all') list = list.filter((v) => v.chain.id === chainFilter)

    const sorted = [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (sortKey === 'rewards') {
        const ra = a.rewards.reduce((s, r) => s + (r.supplyApr ?? 0), 0)
        const rb = b.rewards.reduce((s, r) => s + (r.supplyApr ?? 0), 0)
        cmp = ra - rb
      } else {
        cmp = (a[sortKey] ?? -Infinity) - (b[sortKey] ?? -Infinity)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [vaults, chainFilter, sortKey, sortDir])

  const stats = useMemo(() => {
    if (!vaults || !vaults.length)
      return { count: 0, totalTvl: 0, best: null }
    const totalTvl = vaults.reduce((s, v) => s + (v.totalAssetsUsd ?? 0), 0)
    const best = [...vaults].sort(
      (a, b) => (b.netApy ?? -Infinity) - (a.netApy ?? -Infinity),
    )[0]
    return { count: vaults.length, totalTvl, best }
  }, [vaults])

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Morpho USDC Vault Yields
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Live net APY across {stats.count} USDC-denominated Morpho vaults on Ethereum &amp;
          Base. Auto-refreshes every 60s.
        </p>
      </header>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          accent
          label="Best net APY"
          value={formatApy(stats.best?.netApy)}
          sub={stats.best?.name ?? '—'}
        />
        <StatCard
          label="Total USDC TVL"
          value={formatUsd(stats.totalTvl)}
          sub={`${stats.count} vaults`}
        />
        <StatCard
          label="Avg net APY"
          value={formatApy(
            vaults?.length
              ? vaults.reduce((s, v) => s + (v.netApy ?? 0), 0) / vaults.length
              : null,
          )}
          sub="Across all listed USDC vaults"
        />
      </div>

      {/* Carbon Ads — remove or reposition as needed */}
      <CarbonAd />

      {/* Chain filter */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Chain
        </span>
        <FilterButton
          active={chainFilter === 'all'}
          onClick={() => setChainFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton active={chainFilter === 1} onClick={() => setChainFilter(1)}>
          Ethereum
        </FilterButton>
        <FilterButton
          active={chainFilter === 8453}
          onClick={() => setChainFilter(8453)}
        >
          Base
        </FilterButton>
      </div>

      {/* Table */}
      {isError ? (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-sm text-red-300">
          Failed to load vaults: {String(error?.message ?? 'unknown error')}
        </div>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500">
          Loading vaults…
        </div>
      ) : (
        <VaultTable
          vaults={usdcVaults}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
          expanded={expanded}
          onToggle={(addr) => setExpanded((cur) => (cur === addr ? null : addr))}
        />
      )}

      <footer className="mt-8 text-xs text-zinc-600">
        Data from the public Morpho GraphQL API. Read-only — not financial advice.
      </footer>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-zinc-100 text-zinc-900'
          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
      }`}
    >
      {children}
    </button>
  )
}