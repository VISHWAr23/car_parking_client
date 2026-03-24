import { Car } from 'lucide-react'

/**
 * @param {{ Icon?: React.ComponentType, title?: string, description?: string }} props
 */
export default function EmptyState({
  Icon = Car,
  title = 'Nothing here yet',
  description = '',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 opacity-40" />
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      {description && (
        <p className="text-xs mt-1 text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  )
}
