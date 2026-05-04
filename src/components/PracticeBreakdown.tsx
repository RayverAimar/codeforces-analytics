import { Card } from './ui/Card'
import { getParticipationBreakdown } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface PracticeBreakdownProps {
  submissions: CFSubmission[]
}

const RATE_TYPES: { type: string; label: string }[] = [
  { type: 'CONTESTANT', label: 'Contest AC rate' },
  { type: 'PRACTICE', label: 'Practice AC rate' },
  { type: 'VIRTUAL', label: 'Virtual AC rate' },
]

export function PracticeBreakdown({ submissions }: PracticeBreakdownProps) {
  const breakdown = getParticipationBreakdown(submissions)
  const total = breakdown.reduce((sum, b) => sum + b.count, 0)
  const max = breakdown.reduce((m, b) => (b.count > m ? b.count : m), 1)

  const acRates = RATE_TYPES.map(({ type, label }) => {
    const subs = submissions.filter((s) => s.author.participantType === type)
    const ac = subs.filter((s) => s.verdict === 'OK').length
    const pct = subs.length > 0 ? (ac / subs.length) * 100 : 0
    return { label, pct, hasData: subs.length > 0 }
  })

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Participation</h3>
        <p className="mt-0.5 text-xs text-muted/60">{total.toLocaleString()} submissions</p>
      </div>

      <div className="space-y-2.5">
        {breakdown.map((item) => {
          const pct = total > 0 ? (item.count / total) * 100 : 0
          const barPct = max > 0 ? (item.count / max) * 100 : 0
          return (
            <div key={item.type} className="flex items-center gap-3">
              <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="w-24 flex-shrink-0 text-xs text-muted-bright">{item.label}</div>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${barPct}%`, backgroundColor: item.color }}
                />
              </div>
              <div className="w-20 text-right text-xs text-muted">
                {item.count.toLocaleString()} <span className="text-muted/50">({pct.toFixed(0)}%)</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        {acRates.map(({ label, pct, hasData }) => (
          <div key={label} className="rounded-lg border border-border bg-surface-2 p-3 text-center">
            <div className="mb-1 text-xs text-muted">{label}</div>
            <div className="text-sm font-semibold text-fg-dim">{hasData ? `${pct.toFixed(0)}%` : '—'}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
