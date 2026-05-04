import { Card } from './ui/Card'
import type { CFRatingChange } from '@/types/codeforces'
import { formatDate } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ContestHistoryProps {
  history: CFRatingChange[]
}

export function ContestHistory({ history }: ContestHistoryProps) {
  const recent = [...history].reverse().slice(0, 10)

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Recent Contests</h3>
        <p className="mt-0.5 text-xs text-muted/60">Last {recent.length} contests</p>
      </div>

      <div className="space-y-1">
        {recent.map((h) => {
          const delta = h.newRating - h.oldRating
          const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
          const deltaColor = delta > 0 ? '#4ade80' : delta < 0 ? '#f87171' : '#94a3b8'

          return (
            <div
              key={h.contestId}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-2"
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: deltaColor }} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs text-fg">{h.contestName}</div>
                <div className="text-xs text-muted">{formatDate(h.ratingUpdateTimeSeconds)} · Rank #{h.rank}</div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xs font-semibold text-fg">{h.newRating}</div>
                <div className="text-xs font-medium" style={{ color: deltaColor }}>
                  {delta >= 0 ? '+' : ''}{delta}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
