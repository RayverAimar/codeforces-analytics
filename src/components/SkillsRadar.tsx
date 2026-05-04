import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import { getTagStats } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface SkillsRadarProps {
  submissions: CFSubmission[]
}

const TOP_TAGS = [
  'implementation', 'math', 'greedy', 'dp', 'data structures',
  'brute force', 'constructive algorithms', 'graphs', 'sortings',
  'binary search', 'strings', 'number theory', 'geometry',
  'combinatorics', 'two pointers',
]

export function SkillsRadar({ submissions }: SkillsRadarProps) {
  const tagStats = getTagStats(submissions)
  const tagMap = Object.fromEntries(tagStats.map((t) => [t.tag, t.count]))
  const maxCount = Math.max(...tagStats.map((t) => t.count), 1)

  const indicators = TOP_TAGS.map((tag) => ({ name: tag, max: maxCount }))
  const values = TOP_TAGS.map((tag) => tagMap[tag] ?? 0)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#161616',
      borderColor: '#262626',
      textStyle: { color: '#f5f5f5', fontSize: 12 },
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      center: ['50%', '54%'],
      radius: '65%',
      axisName: {
        color: '#737373',
        fontSize: 10,
        formatter: (v: string) => v.length > 12 ? v.slice(0, 11) + '…' : v,
      },
      splitLine: { lineStyle: { color: '#1e1e1e' } },
      splitArea: { areaStyle: { color: ['#161616', '#0f0f0f'] } },
      axisLine: { lineStyle: { color: '#1e1e1e' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: values,
            name: 'Solved',
            areaStyle: { color: '#6366f130' },
            lineStyle: { color: '#818cf8', width: 2 },
            itemStyle: { color: '#818cf8' },
          },
        ],
      },
    ],
  }

  const top5 = tagStats.slice(0, 5)

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Skills Radar</h3>
        <p className="mt-0.5 text-xs text-muted/60">Problems solved by topic</p>
      </div>
      <ReactECharts option={option} style={{ height: 280 }} />
      <div className="mt-3 flex flex-wrap gap-2">
        {top5.map(({ tag, count }) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-muted-bright"
          >
            {tag} <span className="text-accent font-semibold">{count}</span>
          </span>
        ))}
      </div>
    </Card>
  )
}
