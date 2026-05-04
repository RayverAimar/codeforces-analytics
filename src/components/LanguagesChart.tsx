import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import { getLanguageStats } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface LanguagesChartProps {
  submissions: CFSubmission[]
}

const LANG_COLORS = [
  '#818cf8', '#a78bfa', '#34d399', '#60a5fa', '#f472b6',
  '#fb923c', '#facc15', '#4ade80',
]

export function LanguagesChart({ submissions }: LanguagesChartProps) {
  const stats = getLanguageStats(submissions)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#161616',
      borderColor: '#262626',
      textStyle: { color: '#f5f5f5', fontSize: 12 },
      formatter: (p: any) => `<b>${p.name}</b><br/>${p.value} AC submissions (${p.percent?.toFixed(1)}%)`,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '50%'],
        data: stats.map((s, i) => ({
          name: s.lang,
          value: s.count,
          itemStyle: { color: LANG_COLORS[i % LANG_COLORS.length] },
        })),
        label: {
          show: true,
          color: '#737373',
          fontSize: 10,
          formatter: '{b}\n{d}%',
        },
        labelLine: { lineStyle: { color: '#333333' } },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: '#6366f140' },
        },
      },
    ],
  }

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Languages</h3>
        <p className="mt-0.5 text-xs text-muted/60">By accepted submissions</p>
      </div>
      <ReactECharts option={option} style={{ height: 220 }} />
    </Card>
  )
}
