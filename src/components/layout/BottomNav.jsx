import { Home, History, Settings } from 'lucide-react'
import { TABS } from '@/constants'
import { useStore } from '@/store/useStore'
import { cx } from '@/utils'

const NAV_ITEMS = [
  { id: TABS.HOME,     label: 'Home',     Icon: Home     },
  { id: TABS.HISTORY,  label: 'History',  Icon: History  },
  { id: TABS.SETTINGS, label: 'Settings', Icon: Settings },
]

export default function BottomNav() {
  const tab    = useStore((s) => s.tab)
  const setTab = useStore((s) => s.setTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom pointer-events-none">
      {/* Mobile: full-width bottom bar */}
      <div
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-around px-2 sm:px-4 lg:hidden pointer-events-auto"
        style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}
      >
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cx(
                'flex min-w-[90px] flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all duration-200 sm:min-w-[108px] sm:px-6 font-body',
                active
                  ? 'text-emerald-400 bg-emerald-400/8 scale-105'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-semibold tracking-widest uppercase leading-none">
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Desktop: centered rounded floating nav */}
      <div className="hidden lg:flex justify-center pb-5 pointer-events-none">
        <div
          className="pointer-events-auto inline-flex items-center gap-1 rounded-2xl px-2 py-1.5"
          style={{
            background: 'rgba(13, 17, 23, 0.92)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 14px 34px rgba(0,0,0,0.34)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cx(
                  'flex min-w-[110px] flex-col items-center gap-1 rounded-xl px-5 py-2.5 transition-all duration-200 font-body',
                  active
                    ? 'text-emerald-400 bg-emerald-400/10 scale-[1.02]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.75} />
                <span className="text-[10px] font-semibold tracking-widest uppercase leading-none">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
