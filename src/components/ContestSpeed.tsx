import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import { getContestSolveSpeed } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface ContestSpeedProps {
  submissions: CFSubmission[]
}

const BUCKET_COLORS: Record<string, string> = {
  '0–15m': '#4ade80',
  '15–30m': '#86efac',
  '30–60m': '#818cf8',
  '1–2h': '#a78bfa',
  '2–3h': '#fb923c',
  '3h+': '#f87171',
}

export function ContestSpeed({ submissions }: ContestSpeedProps) {
  const data = getContestSolveSpeed(submissions)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  const fast = data[0].count + data[1].count
  const mid = data[2].count + data[3].count
  const late = data[4].count + data[5].count

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#161616',
      borderColor: '#262626',
      textStyle: { color: '#f5f5f5', fontSize: 12 },
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p
        return `<b>${item.name}</b><br/>${item.value} solve${item.value === 1 ? '' : 's'}`
      },
    },
    grid: { left: 30, right: 8, top: 8, bottom: 24 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.bucket),
      axisLine: { lineStyle: { color: '#1e1e1e' } },
      axisLabel: { color: '#525252', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#525252', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e1e1e', type: 'dashed' as const } },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => ({
          value: d.count,
          name: d.bucket,
          itemStyle: { color: BUCKET_COLORS[d.bucket] ?? '#818cf8', borderRadius: [3, 3, 0, 0] },
        })),
        barMaxWidth: 36,
      },
    ],
  }

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Contest Solve Speed</h3>
        <p className="mt-0.5 text-xs text-muted/60">Time from contest start to AC</p>
      </div>

      {total === 0 ? (
        <div className="flex h-40 items-center justify-center text-xs text-muted">
          No contest submissions found
        </div>
      ) : (
        <>
          <ReactECharts option={option} style={{ height: 180 }} />
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
            {[
              { label: 'Fast solves (≤30m)', value: fast, color: '#4ade80' },
              { label: 'Mid solves (30m–2h)', value: mid, color: '#818cf8' },
              { label: 'Late solves (2h+)', value: late, color: '#f87171' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-border bg-surface-2 p-3 text-center">
                <div className="mb-1 text-xs text-muted">{label}</div>
                <div className="text-sm font-semibold" style={{ color }}>{value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
