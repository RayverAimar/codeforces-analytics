import { Card } from './ui/Card'
import { getAcceptedSubmissions, getRuntimeStats, getUniqueSolvedProblems, getVerdictStats } from '@/lib/utils'
import type { CFSubmission } from '@/types/codeforces'

interface SolvedStatsProps {
  submissions: CFSubmission[]
}

const VERDICT_LABELS: Record<string, { label: string; color: string }> = {
  OK: { label: 'Accepted', color: '#4ade80' },
  WRONG_ANSWER: { label: 'Wrong Answer', color: '#f87171' },
  TIME_LIMIT_EXCEEDED: { label: 'Time Limit', color: '#fb923c' },
  MEMORY_LIMIT_EXCEEDED: { label: 'Memory Limit', color: '#a78bfa' },
  RUNTIME_ERROR: { label: 'Runtime Error', color: '#60a5fa' },
  COMPILATION_ERROR: { label: 'Compile Error', color: '#525252' },
  PRESENTATION_ERROR: { label: 'Presentation', color: '#f472b6' },
}

export function SolvedStats({ submissions }: SolvedStatsProps) {
  const accepted = getAcceptedSubmissions(submissions)
  const unique = getUniqueSolvedProblems(submissions)
  const verdicts = getVerdictStats(submissions)
  const stats = getRuntimeStats(submissions)
  const total = submissions.length
  const acRate = total > 0 ? ((accepted.length / total) * 100).toFixed(1) : '0'

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Solved Statistics</h3>
      </div>

      {/* Key numbers */}
      <div className="mb-5 grid grid-cols-2 gap-2.5">
        {[
          { label: 'Unique Solved', value: unique.length.toLocaleString(), color: '#818cf8' },
          { label: 'AC Submissions', value: accepted.length.toLocaleString(), color: '#4ade80' },
          { label: 'Total Subs', value: total.toLocaleString(), color: '#525252' },
          { label: 'AC Rate', value: `${acRate}%`, color: Number(acRate) >= 50 ? '#4ade80' : '#f87171' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-border bg-surface-2 p-3">
            <div className="mb-1 text-xs text-muted">{label}</div>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Verdict breakdown */}
      <div className="space-y-2.5">
        {verdicts.slice(0, 7).map(({ verdict, count }) => {
          const meta = VERDICT_LABELS[verdict] ?? { label: verdict, color: '#525252' }
          const pct = (count / total) * 100
          return (
            <div key={verdict} className="flex items-center gap-3">
              <div className="w-28 flex-shrink-0 text-xs text-muted-bright">{meta.label}</div>
              <div className="flex-1 overflow-hidden rounded-full bg-surface-3 h-1">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                />
              </div>
              <div className="w-16 text-right text-xs text-muted">
                {count.toLocaleString()} <span className="text-muted/50">({pct.toFixed(0)}%)</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        {[
          { label: 'Avg Runtime', value: `${stats.avgTimeMs}ms` },
          { label: 'Max Runtime', value: `${stats.maxTimeMs}ms` },
          { label: 'Avg Memory', value: `${stats.avgMemMb} MB` },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-xs text-muted">{label}</div>
            <div className="text-sm font-semibold text-fg-dim">{value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
