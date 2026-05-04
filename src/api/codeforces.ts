import type { CFApiResponse, CFRatingChange, CFSubmission, CFUser } from '@/types/codeforces'

const BASE = 'https://codeforces.com/api'

async function cfFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE}/${endpoint}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: CFApiResponse<T> = await res.json()
  if (data.status !== 'OK') throw new Error(data.comment ?? 'Codeforces API error')
  return data.result
}

export async function fetchUser(handle: string): Promise<CFUser> {
  const users = await cfFetch<CFUser[]>(`user.info?handles=${encodeURIComponent(handle)}`)
  return users[0]
}

export async function fetchSubmissions(handle: string): Promise<CFSubmission[]> {
  return cfFetch<CFSubmission[]>(`user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`)
}

export async function fetchRatingHistory(handle: string): Promise<CFRatingChange[]> {
  return cfFetch<CFRatingChange[]>(`user.rating?handle=${encodeURIComponent(handle)}`)
}
