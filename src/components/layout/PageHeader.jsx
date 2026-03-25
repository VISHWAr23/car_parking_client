import { cx } from '@/utils'

/**
 * Sticky top header used by every page/tab.
 * @param {{ eyebrow?: string, title: string, children?: React.ReactNode, className?: string }} props
 */
export default function PageHeader({ eyebrow, title, children, className }) {
  return (
    <header
      className={cx(
        'sticky top-0 z-30 px-4 pb-4 pt-10 sm:px-6 sm:pt-11 lg:px-8',
        'backdrop-blur-sm lg:backdrop-blur-xl',
        className,
      )}
      style={{
        background: 'rgba(3,7,18,0.9)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-end justify-between">
        <div>
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-2xl font-bold tracking-tight leading-none text-[var(--text-primary)]">
            {title}
          </h1>
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  )
}
