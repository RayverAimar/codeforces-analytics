import { cn } from '@/lib/utils'

interface StatBadgeProps {
  label: string
  value: string | number
  color?: string
  className?: string
}

export function StatBadge({ label, value, color, className }: StatBadgeProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-xs text-muted">{label}</span>
      <span className="text-lg font-semibold leading-tight" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  )
}
