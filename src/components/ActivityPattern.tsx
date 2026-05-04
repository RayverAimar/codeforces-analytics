import ReactECharts from 'echarts-for-react'
import { Card } from './ui/Card'
import { getHourlyActivity, getWeekdayActivity } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface ActivityPatternProps {
  submissions: CFSubmission[]
}

export function ActivityPattern({ submissions }: ActivityPatternProps) {
  const hourly = getHourlyActivity(submissions)
  const weekly = getWeekdayActivity(submissions)

  const peakHour = hourly.reduce((acc, h) => (h.count > acc.count ? h : acc), hourly[0])
  const peakDay = weekly.reduce((acc, d) => (d.count > acc.count ? d : acc), weekly[0])

  const baseAxis = {
    axisLine: { lineStyle: { color: '#1e1e1e' } },
    axisLabel: { color: '#525252', fontSize: 10 },
    splitLine: { lineStyle: { color: '#1e1e1e', type: 'dashed' as const } },
  }

  const tooltip = {
    backgroundColor: '#161616',
    borderColor: '#262626',
    textStyle: { color: '#f5f5f5', fontSize: 12 },
  }

  const hourlyOption = {
    backgroundColor: 'transparent',
    tooltip: {
      ...tooltip,
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p
        return `<b>${item.name}:00 UTC</b><br/>${item.value} submission${item.value === 1 ? '' : 's'}`
      },
    },
    grid: { left: 30, right: 8, top: 8, bottom: 24 },
    xAxis: {
      type: 'category',
      data: hourly.map((h) => h.hour),
      ...baseAxis,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...baseAxis,
      axisLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: hourly.map((h) => h.count),
        itemStyle: { color: '#818cf8', borderRadius: [3, 3, 0, 0] },
        barMaxWidth: 14,
      },
    ],
  }

  const weeklyOption = {
    backgroundColor: 'transparent',
    tooltip: {
      ...tooltip,
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p
        return `<b>${item.name}</b><br/>${item.value} submission${item.value === 1 ? '' : 's'}`
      },
    },
    grid: { left: 30, right: 8, top: 8, bottom: 24 },
    xAxis: {
      type: 'category',
      data: weekly.map((w) => w.day),
      ...baseAxis,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...baseAxis,
      axisLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: weekly.map((w) => w.count),
        itemStyle: { color: '#4ade80', borderRadius: [3, 3, 0, 0] },
        barMaxWidth: 32,
      },
    ],
  }

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Activity Pattern</h3>
        <p className="mt-0.5 text-xs text-muted/60">When submissions happen</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">By Hour</div>
              <div className="text-xs text-muted/60">(UTC)</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted">Peak</div>
              <div className="text-sm font-semibold text-accent">{peakHour.hour}:00 UTC</div>
            </div>
          </div>
          <ReactECharts option={hourlyOption} style={{ height: 180 }} />
        </div>
        <div>
          <div className="mb-2 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">By Weekday</div>
              <div className="text-xs text-muted/60">All-time</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted">Peak</div>
              <div className="text-sm font-semibold text-fg">{peakDay.day}</div>
            </div>
          </div>
          <ReactECharts option={weeklyOption} style={{ height: 180 }} />
        </div>
      </div>
    </Card>
  )
}
