import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export function Card({ children, className, title, subtitle }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-5', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-muted/60">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
