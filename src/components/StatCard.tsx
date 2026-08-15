interface Props {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-zinc-800 bg-zinc-900/50'
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold text-zinc-100 tabular-nums">
        {value}
      </div>
      {sub && <div className="mt-1 truncate text-xs text-zinc-500">{sub}</div>}
    </div>
  )
}