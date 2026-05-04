import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import { getDifficultyDistribution, getUniqueSolvedProblems } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface DifficultyChartProps {
  submissions: CFSubmission[]
}

const RATING_COLORS: Record<number, string> = {
  800: '#cccccc', 900: '#cccccc', 1000: '#cccccc', 1100: '#77ff77',
  1200: '#77ff77', 1300: '#77ff77', 1400: '#03a89e', 1500: '#03a89e',
  1600: '#7070ff', 1700: '#7070ff', 1800: '#7070ff', 1900: '#aa00aa',
  2000: '#aa00aa', 2100: '#ffbb55', 2200: '#ffbb55', 2300: '#ff8c00',
  2400: '#ff3333', 2500: '#ff3333', 2600: '#ff0000', 2700: '#ff0000',
  2800: '#ff0000', 2900: '#ff0000', 3000: '#ff0000', 3100: '#ff0000',
  3200: '#ff0000', 3300: '#ff0000', 3400: '#ff0000', 3500: '#ff0000',
}

export function DifficultyChart({ submissions }: DifficultyChartProps) {
  const dist = getDifficultyDistribution(submissions)
  const solved = getUniqueSolvedProblems(submissions)
  const withRating = solved.filter((s) => s.problem.rating).length
  const avgRating = withRating > 0
    ? Math.round(solved.filter((s) => s.problem.rating).reduce((sum, s) => sum + s.problem.rating!, 0) / withRating)
    : 0

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#161616',
      borderColor: '#262626',
      textStyle: { color: '#f5f5f5', fontSize: 12 },
      formatter: (p: any) => `<b>${p.name}</b><br/>${p.value} problem${p.value > 1 ? 's' : ''} solved`,
    },
    grid: { left: 40, right: 10, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      data: dist.map((d) => d.rating),
      axisLine: { lineStyle: { color: '#1e1e1e' } },
      axisLabel: { color: '#525252', fontSize: 9, rotate: 45 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#525252', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e1e1e', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: dist.map((d) => ({
          value: d.count,
          name: d.rating,
          itemStyle: { color: RATING_COLORS[d.rating] ?? '#818cf8', borderRadius: [3, 3, 0, 0] },
        })),
        barMaxWidth: 24,
      },
    ],
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Difficulty Distribution</h3>
          <p className="mt-0.5 text-xs text-muted/60">Problems solved by rating</p>
        </div>
        {avgRating > 0 && (
          <div className="text-right">
            <div className="text-xs text-muted">Avg Difficulty</div>
            <div className="text-sm font-semibold" style={{ color: RATING_COLORS[Math.round(avgRating / 100) * 100] ?? '#818cf8' }}>
              {avgRating}
            </div>
          </div>
        )}
      </div>
      <ReactECharts option={option} style={{ height: 220 }} />
    </Card>
  )
}
