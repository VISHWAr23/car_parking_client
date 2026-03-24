import { useState } from 'react'
import { BarChart3, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import { formatDate, calculateRentAmount } from '@/utils'

/**
 * Toggleable daily summary panel for the Owner dashboard.
 * @param {{ sessions: object[], history: object[] }} props
 */
export default function DailySummary({ sessions, history }) {
  const [open, setOpen] = useState(false)

  const totalEntries = sessions.length + history.length
  const totalExits   = history.length
  const totalCash    = history.reduce((acc, h) => acc + (h.rentAmount ?? 0), 0)
  const avgFee       = totalExits > 0 ? Math.round(totalCash / totalExits) : 0
  const projectedMonthEnd = sessions.reduce(
    (acc, s) => acc + calculateRentAmount(s.entryDate, s.rentPerDay),
    0,
  )

  const rows = [
    { label: 'Total Entries Today',   value: totalEntries,    unit: '',   color: 'text-emerald-400' },
    { label: 'Total Exits Today',     value: totalExits,      unit: '',   color: 'text-rose-400'    },
    { label: 'Total Rent Settled',  value: `₹${totalCash}`, unit: '',   color: 'text-amber-400'   },
    { label: 'Projected Month-End Rent', value: `₹${projectedMonthEnd}`, unit: '',   color: 'text-sky-400'     },
    { label: 'Average Settlement / Car', value: `₹${avgFee}`,    unit: '',   color: 'text-emerald-400'     },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      {/* Toggle Row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/[0.02] transition-colors"
        style={{ background: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--amber-dim)' }}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-[var(--text-primary)]">Daily Summary</p>
            <p className="text-[11px] text-[var(--text-muted)]">{formatDate()}</p>
          </div>
        </div>
        {open
          ? <ChevronUp  className="w-4 h-4 text-[var(--text-muted)]" />
          : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
      </button>

      {/* Expandable Content */}
      {open && (
        <div
          className="px-4 pb-5 pt-1 animate-slide-up"
          style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="flex flex-col gap-0">
            {rows.map(({ label, value, color }, i) => (
              <div
                key={label}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
              >
                <span className="text-sm text-[var(--text-secondary)]">{label}</span>
                <span className={`font-display font-bold text-sm ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Performance bar */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                Turnover Rate
              </span>
            </div>
            <div className="fill-bar">
              <div
                className="fill-bar__inner"
                style={{ width: `${totalEntries > 0 ? Math.round((totalExits / totalEntries) * 100) : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5 text-right">
              {totalEntries > 0 ? Math.round((totalExits / totalEntries) * 100) : 0}% of vehicles checked out
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
