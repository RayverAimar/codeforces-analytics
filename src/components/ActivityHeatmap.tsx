import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import { getActivityHeatmap, getStreakStats } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface ActivityHeatmapProps {
  submissions: CFSubmission[]
}

export function ActivityHeatmap({ submissions }: ActivityHeatmapProps) {
  const heatmap = getActivityHeatmap(submissions)
  const streaks = getStreakStats(submissions)

  const now = new Date()
  const yearAgo = new Date(now)
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)

  // Build full date range so empty days render dark instead of white
  const allDates: string[] = []
  const cursor = new Date(yearAgo)
  while (cursor <= now) {
    allDates.push(cursor.toISOString().split('T')[0])
    cursor.setDate(cursor.getDate() + 1)
  }

  const data = allDates.map((date) => [date, heatmap[date] ?? 0])
  const activeDays = data.filter(([, c]) => (c as number) > 0).length
  const maxCount = Math.max(...data.map(([, c]) => c as number), 1)
  const totalSubmissions = data.reduce((sum, [, c]) => sum + (c as number), 0)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#161616',
      borderColor: '#262626',
      textStyle: { color: '#f1f5f9', fontSize: 12 },
      formatter: (p: any) => {
        if (!p.data || p.data[1] === 0) return ''
        return `<b>${p.data[0]}</b><br/>${p.data[1]} submission${p.data[1] > 1 ? 's' : ''}`
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: maxCount,
      inRange: {
        color: ['#161616', '#312e81', '#4338ca', '#6366f1', '#818cf8'],
      },
    },
    calendar: {
      top: 20,
      left: 30,
      right: 10,
      bottom: 10,
      cellSize: ['auto', 13],
      range: [yearAgo.toISOString().split('T')[0], now.toISOString().split('T')[0]],
      itemStyle: { color: '#161616', borderWidth: 2, borderColor: '#080808' },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: { color: '#525252', fontSize: 10 },
      dayLabel: { color: '#525252', fontSize: 9, nameMap: ['Sun', 'Mon', '', 'Wed', '', 'Fri', ''] },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data,
      },
    ],
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Submission Activity</h3>
          <p className="mt-0.5 text-xs text-muted/60">Last 12 months</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-xs text-muted">Active Days</div>
            <div className="text-sm font-semibold text-fg">{activeDays}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Submissions</div>
            <div className="text-sm font-semibold text-fg">{totalSubmissions.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Cur. Streak</div>
            <div className="text-sm font-semibold text-accent">{streaks.current}d</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Max Streak</div>
            <div className="text-sm font-semibold text-fg">{streaks.max}d</div>
          </div>
        </div>
      </div>
      <ReactECharts option={option} style={{ height: 150 }} />
    </Card>
  )
}
