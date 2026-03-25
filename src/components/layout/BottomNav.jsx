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
    <nav className="fixed inset-x-0 bottom-0 z-40 safe-bottom pointer-events-none">
      {/* Mobile: floating bottom bar */}
      <div
        className="mx-auto mb-2 flex h-[var(--bottom-nav-height-mobile)] w-[calc(100%-1rem)] max-w-lg items-center justify-around rounded-2xl px-2 sm:w-[calc(100%-1.5rem)] lg:hidden pointer-events-auto"
        style={{
          background: 'rgba(13, 17, 23, 0.92)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.34)',
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
                'flex min-w-[86px] flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 sm:min-w-[104px] sm:px-5 font-body',
                active
                  ? 'text-emerald-300 bg-emerald-400/14'
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
      <div className="hidden lg:flex justify-center pb-4 pointer-events-none">
        <div
          className="pointer-events-auto inline-flex h-[var(--bottom-nav-height-desktop)] items-center gap-1 rounded-2xl px-2"
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
                    'flex min-w-[110px] flex-col items-center gap-1 rounded-xl px-5 py-2 transition-all duration-200 font-body',
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
