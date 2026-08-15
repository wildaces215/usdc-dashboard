interface Props {
  chainId: number
  network?: string
}

const CHAIN_STYLES: Record<number, string> = {
  1: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  8453: 'bg-blue-400/15 text-sky-300 ring-sky-400/30',
}

const CHAIN_LABEL: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
}

export function ChainBadge({ chainId, network }: Props) {
  const label = CHAIN_LABEL[chainId] ?? network ?? `Chain ${chainId}`
  const style = CHAIN_STYLES[chainId] ?? 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  )
}