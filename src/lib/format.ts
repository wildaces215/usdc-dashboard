// Display formatting helpers.

/** Format a decimal APY (0.0412 => 4.12%) as a percentage string. */
export function formatApy(apy: number | null | undefined, digits = 2): string {
  if (apy == null || Number.isNaN(apy)) return '—'
  return `${(apy * 100).toFixed(digits)}%`
}

/** Compact USD, e.g. 586_969_562 => "$587M". */
export function formatUsd(usd: number | null | undefined): string {
  if (usd == null || Number.isNaN(usd)) return '—'
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)}B`
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`
  if (usd >= 1e3) return `$${(usd / 1e3).toFixed(1)}K`
  return `$${usd.toFixed(0)}`
}

/** Full USD with thousands separators, e.g. "$586,969,562". */
export function formatUsdFull(usd: number | null | undefined): string {
  if (usd == null || Number.isNaN(usd)) return '—'
  return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

/** Format a decimal fee fraction (0.25 => 25%) — Morpho fees are fractions. */
export function formatFee(fee: number | null | undefined): string {
  if (fee == null || Number.isNaN(fee)) return '—'
  return `${(fee * 100).toFixed(fee === 0 ? 0 : 1)}%`
}

/** Shorten an Ethereum address: 0x1234…abcd. */
export function shortAddress(addr: string): string {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

/** Sum reward APRs for a vault (already a decimal). */
export function totalRewardApr(rewards: { supplyApr: number | null }[]): number {
  return rewards.reduce((sum, r) => sum + (r.supplyApr ?? 0), 0)
}