import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import type { ApyPoint } from '../types/morpho'
import { formatApy } from '../lib/format'

interface Props {
  points: ApyPoint[]
  loading?: boolean
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function ApyChart({ points, loading }: Props) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
        Loading history…
      </div>
    )
  }
  if (!points.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
        No history available.
      </div>
    )
  }

  // Dynamic Y domain with a little padding so the line isn't glued to an edge.
  const ys = points.map((p) => p.y)
  const min = Math.min(...ys)
  const max = Math.max(...ys)
  const pad = Math.max((max - min) * 0.15, 0.001)
  const yDomain: [number, number] = [min - pad, max + pad]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="apyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="x"
            tickFormatter={formatDate}
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={false}
            minTickGap={32}
          />
          <YAxis
            domain={yDomain}
            tickFormatter={(v) => formatApy(v, 1)}
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickCount={4}
          />
          <Tooltip
            contentStyle={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#a1a1aa' }}
            labelFormatter={(label: unknown) => formatDate(Number(label))}
            formatter={(value: unknown) => [formatApy(Number(value)), 'Net APY']}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#apyFill)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}