import { cx } from '@/utils'

const colorMap = {
  green: {
    icon: 'text-emerald-400 bg-emerald-400/10',
    value: 'text-emerald-400',
  },
  rose: {
    icon: 'text-rose-400 bg-rose-400/10',
    value: 'text-rose-400',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-400/10',
    value: 'text-amber-400',
  },
  sky: {
    icon: 'text-sky-400 bg-sky-400/10',
    value: 'text-sky-400',
  },
}

/**
 * @param {{ label: string, value: string|number, Icon: React.ComponentType, color?: string, sub?: string }} props
 */
export default function StatCard({ label, value, Icon, color = 'green', sub }) {
  const c = colorMap[color] ?? colorMap.green

  return (
    <div className="card p-4 flex flex-col gap-3 hover:border-white/10 transition-colors">
      <div className={cx('rounded-xl p-2.5 w-fit', c.icon)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={cx('font-display text-2xl font-bold leading-none tracking-tight', c.value)}>
          {value}
        </p>
        {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
      </div>
      <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest leading-tight">
        {label}
      </p>
    </div>
  )
}
