import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CFSubmission } from '@/types/codeforces'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRankColor(rank: string): string {
  const r = rank?.toLowerCase() ?? ''
  if (r.includes('legendary') || r === 'international grandmaster') return '#ff0000'
  if (r === 'grandmaster') return '#ff3333'
  if (r.includes('international master')) return '#ff8c00'
  if (r === 'master') return '#ffbb55'
  if (r.includes('candidate')) return '#aa00aa'
  if (r === 'expert') return '#7070ff'
  if (r === 'specialist') return '#03a89e'
  if (r === 'pupil') return '#77ff77'
  return '#cccccc'
}

export function getRankClass(rank: string): string {
  return `rank-${rank?.toLowerCase().replace(/\s+/g, '-') ?? 'newbie'}`
}

export function formatDate(seconds: number): string {
  return new Date(seconds * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(seconds: number): string {
  const now = Date.now() / 1000
  const diff = now - seconds
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(seconds)
}

export function getAcceptedSubmissions(submissions: CFSubmission[]): CFSubmission[] {
  return submissions.filter((s) => s.verdict === 'OK')
}

export function getUniqueSolvedProblems(submissions: CFSubmission[]): CFSubmission[] {
  const seen = new Set<string>()
  return getAcceptedSubmissions(submissions).filter((s) => {
    const key = `${s.problem.contestId}-${s.problem.index}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getTagStats(submissions: CFSubmission[]): { tag: string; count: number }[] {
  const solved = getUniqueSolvedProblems(submissions)
  const counts: Record<string, number> = {}
  for (const s of solved) {
    for (const tag of s.problem.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getDifficultyDistribution(submissions: CFSubmission[]): { rating: number; count: number }[] {
  const solved = getUniqueSolvedProblems(submissions)
  const buckets: Record<number, number> = {}
  for (const s of solved) {
    if (s.problem.rating) {
      const bucket = Math.round(s.problem.rating / 100) * 100
      buckets[bucket] = (buckets[bucket] ?? 0) + 1
    }
  }
  return Object.entries(buckets)
    .map(([r, c]) => ({ rating: Number(r), count: c }))
    .sort((a, b) => a.rating - b.rating)
}

export function getLanguageStats(submissions: CFSubmission[]): { lang: string; count: number }[] {
  const accepted = getAcceptedSubmissions(submissions)
  const counts: Record<string, number> = {}
  for (const s of accepted) {
    const lang = normalizeLanguage(s.programmingLanguage)
    counts[lang] = (counts[lang] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([lang, count]) => ({ lang, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

function normalizeLanguage(lang: string): string {
  if (lang.includes('C++')) return 'C++'
  if (lang.includes('Python')) return 'Python'
  if (lang.includes('Java')) return 'Java'
  if (lang.includes('Kotlin')) return 'Kotlin'
  if (lang.includes('Go')) return 'Go'
  if (lang.includes('Rust')) return 'Rust'
  if (lang.includes('C#')) return 'C#'
  if (lang.startsWith('C ')) return 'C'
  return lang
}

export function getVerdictStats(submissions: CFSubmission[]): { verdict: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const s of submissions) {
    const v = s.verdict ?? 'UNKNOWN'
    counts[v] = (counts[v] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([verdict, count]) => ({ verdict, count }))
    .sort((a, b) => b.count - a.count)
}

export function getActivityHeatmap(submissions: CFSubmission[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const s of submissions) {
    const d = new Date(s.creationTimeSeconds * 1000)
    const key = d.toISOString().split('T')[0]
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

export function getStreakStats(submissions: CFSubmission[]): { current: number; max: number } {
  if (submissions.length === 0) return { current: 0, max: 0 }
  const dateSet = new Set<string>()
  for (const s of submissions) {
    const d = new Date(s.creationTimeSeconds * 1000)
    dateSet.add(d.toISOString().split('T')[0])
  }
  const sorted = Array.from(dateSet).sort()
  let max = 0
  let run = 0
  let prev: Date | null = null
  for (const d of sorted) {
    const cur = new Date(d + 'T00:00:00Z')
    if (prev) {
      const diff = (cur.getTime() - prev.getTime()) / 86400000
      run = diff === 1 ? run + 1 : 1
    } else {
      run = 1
    }
    if (run > max) max = run
    prev = cur
  }

  const today = new Date()
  const todayKey = today.toISOString().split('T')[0]
  const yesterday = new Date(today.getTime() - 86400000)
  const yesterdayKey = yesterday.toISOString().split('T')[0]

  let current = 0
  let cursor: Date
  if (dateSet.has(todayKey)) {
    cursor = new Date(todayKey + 'T00:00:00Z')
  } else if (dateSet.has(yesterdayKey)) {
    cursor = new Date(yesterdayKey + 'T00:00:00Z')
  } else {
    return { current: 0, max }
  }
  while (dateSet.has(cursor.toISOString().split('T')[0])) {
    current++
    cursor = new Date(cursor.getTime() - 86400000)
  }
  return { current, max }
}

export function getHourlyActivity(submissions: CFSubmission[]): { hour: number; count: number }[] {
  const counts: number[] = Array(24).fill(0)
  for (const s of submissions) {
    const h = new Date(s.creationTimeSeconds * 1000).getUTCHours()
    counts[h]++
  }
  return counts.map((count, hour) => ({ hour, count }))
}

export function getWeekdayActivity(submissions: CFSubmission[]): { day: string; count: number }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts: number[] = Array(7).fill(0)
  for (const s of submissions) {
    const d = new Date(s.creationTimeSeconds * 1000).getUTCDay()
    counts[d]++
  }
  return counts.map((count, i) => ({ day: days[i], count }))
}

const PARTICIPATION_META: Record<string, { label: string; color: string }> = {
  CONTESTANT: { label: 'Contest', color: '#818cf8' },
  PRACTICE: { label: 'Practice', color: '#4ade80' },
  VIRTUAL: { label: 'Virtual', color: '#fb923c' },
  OUT_OF_COMPETITION: { label: 'Out of comp.', color: '#60a5fa' },
}

export function getParticipationBreakdown(
  submissions: CFSubmission[],
): { type: string; label: string; count: number; color: string }[] {
  const counts: Record<string, number> = {}
  for (const s of submissions) {
    const t = s.author.participantType
    counts[t] = (counts[t] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([type, count]) => {
      const meta = PARTICIPATION_META[type] ?? { label: type, color: '#525252' }
      return { type, label: meta.label, count, color: meta.color }
    })
    .sort((a, b) => b.count - a.count)
}

export function getContestSolveSpeed(submissions: CFSubmission[]): { bucket: string; count: number }[] {
  const buckets = [
    { bucket: '0–15m', max: 900 },
    { bucket: '15–30m', max: 1800 },
    { bucket: '30–60m', max: 3600 },
    { bucket: '1–2h', max: 7200 },
    { bucket: '2–3h', max: 10800 },
    { bucket: '3h+', max: Infinity },
  ]
  const counts: number[] = Array(buckets.length).fill(0)
  for (const s of submissions) {
    if (s.verdict !== 'OK') continue
    if (s.author.participantType !== 'CONTESTANT') continue
    if (s.relativeTimeSeconds >= 400000) continue
    const t = s.relativeTimeSeconds
    for (let i = 0; i < buckets.length; i++) {
      if (t < buckets[i].max) {
        counts[i]++
        break
      }
    }
  }
  return buckets.map((b, i) => ({ bucket: b.bucket, count: counts[i] }))
}

export function getRuntimeStats(submissions: CFSubmission[]): { avgTimeMs: number; maxTimeMs: number; avgMemMb: number } {
  const ac = submissions.filter((s) => s.verdict === 'OK' && s.timeConsumedMillis > 0)
  if (ac.length === 0) return { avgTimeMs: 0, maxTimeMs: 0, avgMemMb: 0 }
  let timeSum = 0
  let memSum = 0
  let maxTime = 0
  for (const s of ac) {
    timeSum += s.timeConsumedMillis
    memSum += s.memoryConsumedBytes
    if (s.timeConsumedMillis > maxTime) maxTime = s.timeConsumedMillis
  }
  return {
    avgTimeMs: Math.round(timeSum / ac.length),
    maxTimeMs: maxTime,
    avgMemMb: Math.round(memSum / ac.length / (1024 * 1024)),
  }
}
