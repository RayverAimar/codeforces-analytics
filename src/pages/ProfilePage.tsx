import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchUser, fetchSubmissions, fetchRatingHistory } from '@/api/codeforces'
import type { CFUser, CFSubmission, CFRatingChange } from '@/types/codeforces'
import { ProfileCard } from '@/components/ProfileCard'
import { RatingChart } from '@/components/RatingChart'
import { ActivityHeatmap } from '@/components/ActivityHeatmap'
import { SkillsRadar } from '@/components/SkillsRadar'
import { DifficultyChart } from '@/components/DifficultyChart'
import { LanguagesChart } from '@/components/LanguagesChart'
import { SolvedStats } from '@/components/SolvedStats'
import { ContestHistory } from '@/components/ContestHistory'
import { ActivityPattern } from '@/components/ActivityPattern'
import { PracticeBreakdown } from '@/components/PracticeBreakdown'
import { ContestSpeed } from '@/components/ContestSpeed'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

export function ProfilePage() {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<CFUser | null>(null)
  const [submissions, setSubmissions] = useState<CFSubmission[]>([])
  const [ratingHistory, setRatingHistory] = useState<CFRatingChange[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!handle) return

    setLoading(true)
    setError(null)
    setUser(null)
    setSubmissions([])
    setRatingHistory([])

    Promise.all([
      fetchUser(handle),
      fetchSubmissions(handle),
      fetchRatingHistory(handle),
    ])
      .then(([u, s, r]) => {
        setUser(u)
        setSubmissions(s)
        setRatingHistory(r)
      })
      .catch((e) => setError(e.message ?? 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [handle])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-muted-bright">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
        <span>Loading <span className="font-mono text-accent">{handle}</span>…</span>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <div>
          <p className="font-semibold text-fg">Could not load profile</p>
          <p className="mt-1 text-sm text-muted">{error ?? 'Unknown error'}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-fg transition-colors hover:bg-surface-3"
        >
          Try another handle
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Search another handle
      </button>

      <ProfileCard user={user} />
      <RatingChart history={ratingHistory} />
      <ActivityHeatmap submissions={submissions} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkillsRadar submissions={submissions} />
        <DifficultyChart submissions={submissions} />
      </div>

      <ActivityPattern submissions={submissions} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SolvedStats submissions={submissions} />
        <LanguagesChart submissions={submissions} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PracticeBreakdown submissions={submissions} />
        <ContestSpeed submissions={submissions} />
      </div>

      <ContestHistory history={ratingHistory} />
    </div>
  )
}
