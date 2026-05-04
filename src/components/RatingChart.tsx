import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import type { CFRatingChange } from '@/types/codeforces'
import { getRankColor } from '@/lib/utils'

interface RatingChartProps {
  history: CFRatingChange[]
}

const RANK_ZONES = [
  { min: 0, max: 1199, color: '#cccccc22', label: 'Newbie' },
  { min: 1200, max: 1399, color: '#77ff7722', label: 'Pupil' },
  { min: 1400, max: 1599, color: '#03a89e22', label: 'Specialist' },
  { min: 1600, max: 1899, color: '#7070ff22', label: 'Expert' },
  { min: 1900, max: 2099, color: '#aa00aa22', label: 'Candidate Master' },
  { min: 2100, max: 2299, color: '#ffbb5522', label: 'Master' },
  { min: 2300, max: 2399, color: '#ff8c0022', label: 'Int. Master' },
  { min: 2400, max: 2599, color: '#ff333322', label: 'Grandmaster' },
  { min: 2600, max: 2999, color: '#ff000022', label: 'Int. Grandmaster' },
  { min: 3000, max: 9999, color: '#ff000033', label: 'Legendary' },
]

export function RatingChart({ history }: RatingChartProps) {
  if (history.length === 0) {
    return (
      <Card title="Rating History" subtitle="No contest history found">
        <div className="flex h-40 items-center justify-center text-muted">
          No contests participated yet
        </div>
      </Card>
    )
  }

  const dates = history.map((h) => new Date(h.ratingUpdateTimeSeconds * 1000).toLocaleDateString())
  const ratings = history.map((h) => h.newRating)
  const maxRating = Math.max(...ratings)
  const minRating = Math.min(...ratings)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#161616',
      borderColor: '#262626',
      textStyle: { color: '#f5f5f5', fontSize: 12 },
      formatter: (params: any[]) => {
        const p = params[0]
        const h = history[p.dataIndex]
        const delta = h.newRating - h.oldRating
        const sign = delta >= 0 ? '+' : ''
        return `
          <div style="min-width:180px">
            <div style="font-weight:600;margin-bottom:4px">${h.contestName}</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:6px">${dates[p.dataIndex]}</div>
            <div>Rating: <span style="color:#818cf8;font-weight:600">${h.newRating}</span></div>
            <div>Change: <span style="color:${delta >= 0 ? '#4ade80' : '#f87171'};font-weight:600">${sign}${delta}</span></div>
            <div style="color:#94a3b8">Rank: #${h.rank}</div>
          </div>
        `
      },
    },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#1e1e1e' } },
      axisLabel: { color: '#525252', fontSize: 10, interval: Math.floor(history.length / 8) },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#525252', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e1e1e', type: 'dashed' } },
      min: Math.max(0, minRating - 200),
    },
    visualMap: {
      show: false,
      type: 'piecewise',
      dimension: 1,
      pieces: RANK_ZONES.map((z) => ({ min: z.min, max: z.max, color: z.color.replace('22', 'ff').replace('33', 'ff') })),
    },
    series: [
      {
        type: 'line',
        data: ratings,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: history.length > 50 ? 4 : 6,
        lineStyle: { color: '#818cf8', width: 2 },
        itemStyle: { color: '#818cf8', borderColor: '#1c1c2a', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#6366f140' },
              { offset: 1, color: '#6366f100' },
            ],
          },
        },
        markPoint: {
          symbol: 'pin',
          symbolSize: 36,
          data: [
            { type: 'max', name: 'Peak', itemStyle: { color: '#4ade80' } },
          ],
          label: { fontSize: 10, fontWeight: 'bold' },
        },
      },
    ],
  }

  const totalContests = history.length
  const bestRank = Math.min(...history.map((h) => h.rank))
  const avgDelta = Math.round(history.reduce((sum, h) => sum + (h.newRating - h.oldRating), 0) / history.length)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Rating History</h3>
          <p className="mt-0.5 text-xs text-muted/60">{totalContests} contests</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-xs text-muted">Best Rank</div>
            <div className="text-sm font-semibold text-fg">#{bestRank}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Avg Δ</div>
            <div className={`text-sm font-semibold ${avgDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {avgDelta >= 0 ? '+' : ''}{avgDelta}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Peak</div>
            <div className="text-sm font-semibold" style={{ color: getRankColor('') || '#ffbb55' }}>
              {maxRating}
            </div>
          </div>
        </div>
      </div>
      <ReactECharts option={option} style={{ height: 280 }} />
    </Card>
  )
}
