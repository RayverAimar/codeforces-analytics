import { formatDate, formatRelativeTime, getRankColor } from '@/lib/utils'
import type { CFUser } from '@/types/codeforces'
import { Globe, MapPin, Users, Clock } from 'lucide-react'

interface ProfileCardProps {
  user: CFUser
}

export function ProfileCard({ user }: ProfileCardProps) {
  const rankColor = getRankColor(user.rank)
  const maxRankColor = getRankColor(user.maxRank)
  const ratingDiff = user.maxRating - user.rating

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="h-20 w-20 rounded-xl border-2 p-0.5"
            style={{ borderColor: rankColor }}
          >
            <img
              src={user.titlePhoto}
              alt={user.handle}
              className="h-full w-full rounded-[9px] object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = `https://userpic.codeforces.org/no-title.jpg`
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-fg">{user.handle}</h1>
              <span
                className="rounded px-1.5 py-0.5 text-xs font-medium"
                style={{ color: rankColor, backgroundColor: `${rankColor}15` }}
              >
                {user.rank}
              </span>
            </div>
            {(user.firstName || user.lastName) && (
              <p className="mt-0.5 text-sm text-muted-bright">
                {[user.firstName, user.lastName].filter(Boolean).join(' ')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {user.country && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {user.country}{user.city ? `, ${user.city}` : ''}
              </span>
            )}
            {user.organization && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {user.organization}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(user.lastOnlineTimeSeconds)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {user.friendOfCount.toLocaleString()} friends
            </span>
          </div>

          {/* Rating stats */}
          <div className="flex flex-wrap gap-6 pt-1">
            <div>
              <div className="text-xs text-muted">Rating</div>
              <div className="text-xl font-bold" style={{ color: rankColor }}>{user.rating.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Peak</div>
              <div className="text-xl font-bold" style={{ color: maxRankColor }}>
                {user.maxRating.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted">Contribution</div>
              <div className="text-xl font-bold text-violet-400">+{user.contribution}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Joined</div>
              <div className="text-sm font-medium text-fg-dim">{formatDate(user.registrationTimeSeconds)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak info bar */}
      {ratingDiff > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
          Peak was{' '}
          <span style={{ color: maxRankColor }} className="font-semibold">{user.maxRating}</span>
          {' '}({user.maxRank}) — {ratingDiff} below peak
        </div>
      )}
      {ratingDiff === 0 && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent-dim px-3 py-2 text-xs text-accent">
          At all-time peak rating
        </div>
      )}
    </div>
  )
}
