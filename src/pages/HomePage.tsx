import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Activity, BarChart2, Layers } from 'lucide-react'

const EXAMPLES = ['tourist', 'Petr', 'Um_nik', 'ecnerwala', 'neal']

const FEATURES = [
  { icon: TrendingUp, label: 'Rating History' },
  { icon: Activity, label: 'Heatmap' },
  { icon: Layers, label: 'Skills Radar' },
  { icon: BarChart2, label: 'Difficulty Stats' },
]

export function HomePage() {
  const [handle, setHandle] = useState('')
  const navigate = useNavigate()

  const submit = () => {
    const h = handle.trim()
    if (h) navigate(`/user/${h}`)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-12 py-12 animate-slide-up">
      {/* Heading */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          Codeforces Analytics
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
          Deep insights into any Codeforces profile. Rating history, skill breakdown, contest trends, and more.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Enter a handle…"
              autoFocus
              className="w-full rounded-lg border border-border bg-surface-2 py-3 pl-10 pr-4 text-sm text-fg placeholder-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/20"
            />
          </div>
          <button
            onClick={submit}
            disabled={!handle.trim()}
            className="rounded-lg bg-accent-2 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            Go
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted">e.g.</span>
          {EXAMPLES.map((h) => (
            <button
              key={h}
              onClick={() => navigate(`/user/${h}`)}
              className="rounded border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted-bright transition-all hover:border-accent/50 hover:bg-surface-3 hover:text-accent"
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="grid w-full max-w-sm grid-cols-2 gap-2 sm:max-w-lg sm:grid-cols-4">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition-colors hover:border-border-bright hover:bg-surface-2"
          >
            <Icon className="h-4 w-4 text-muted" />
            <span className="text-xs text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
