import { useState } from 'react'
import { LogIn, Car } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useCapacity } from '@/hooks/useCapacity'
import { useLiveClock } from '@/hooks/useLiveClock'
import PageHeader from '@/components/layout/PageHeader'
import CapacityBar from '@/components/ui/CapacityBar'
import SessionCard from '@/components/dashboard/SessionCard'
import EmptyState from '@/components/ui/EmptyState'
import EntryModal from '@/components/modals/EntryModal'
import { cx } from '@/utils'

export default function LaborerHome() {
  const sessions     = useStore((s) => s.sessions)
  const parkingLoading = useStore((s) => s.parkingLoading)
  const parkingError = useStore((s) => s.parkingError)
  const sessionViewMode = useStore((s) => s.sessionViewMode)
  const setSessionViewMode = useStore((s) => s.setSessionViewMode)
  const { occupied, total, pct, status } = useCapacity()
  const clock = useLiveClock()

  const [showEntry, setShowEntry] = useState(false)

  const statusColor =
    status === 'critical' ? 'text-rose-400'  :
    status === 'warning'  ? 'text-amber-400' :
                            'text-emerald-400'

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PageHeader eyebrow="Operations Console" title="ParkOS">
        <div className="text-right">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{clock}</p>
        </div>
      </PageHeader>

      <div className="flex flex-1 flex-col gap-5 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            {/* Slot Counter */}
            <div
              className="rounded-2xl px-5 py-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Slots Occupied
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display text-4xl font-bold leading-none ${statusColor}`}>
                      {occupied}
                    </span>
                    <span className="font-display text-xl font-semibold text-[var(--text-muted)]">
                      / {total}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-display text-2xl font-bold ${statusColor}`}>{pct}%</p>
                  <p className="text-[10px] capitalize text-[var(--text-muted)]">{status}</p>
                </div>
              </div>
              <CapacityBar pct={pct} status={status} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setShowEntry(true)}
                className="select-none rounded-2xl py-6 text-base font-bold transition-all duration-150 active:scale-[0.97] flex flex-col items-center justify-center gap-3"
                style={{
                  background: 'var(--green-dim)',
                  border: '2px solid var(--green-border)',
                  color: 'var(--green-vivid)',
                  boxShadow: '0 8px 32px rgba(63,185,80,0.08)',
                }}
              >
                <LogIn className="h-7 w-7" />
                New Car Entry
              </button>
            </div>
          </div>

          {/* Active List */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] truncate">
                Active Parking Records
              </p>
              <div className="flex items-center gap-2">
                <div className="rounded-lg p-0.5" style={{ background: 'var(--bg-overlay)' }}>
                  <button
                    onClick={() => setSessionViewMode('list')}
                    className={cx(
                      'px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-md transition-colors',
                      sessionViewMode === 'list'
                        ? 'bg-emerald-500 text-gray-950'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setSessionViewMode('cards')}
                    className={cx(
                      'px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-md transition-colors',
                      sessionViewMode === 'cards'
                        ? 'bg-emerald-500 text-gray-950'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    Cards
                  </button>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: 'var(--green-dim)', color: 'var(--green-vivid)' }}
                >
                  {sessions.length}
                </span>
              </div>
            </div>

            {parkingLoading && (
              <div
                className="mb-3 rounded-xl px-3 py-2.5 text-xs"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                Syncing live parking records...
              </div>
            )}

            {parkingError && (
              <div
                className="mb-3 rounded-xl px-3 py-2.5 text-xs"
                style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)', color: 'rgb(252 165 165)' }}
              >
                {parkingError}
              </div>
            )}

            {sessions.length === 0 ? (
              <EmptyState
                Icon={Car}
                title="No active parked cars"
                description="Tap 'New Car Entry' to register a parked car"
              />
            ) : (
              <div className={cx(
                sessionViewMode === 'cards'
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                  : 'flex flex-col gap-2.5',
              )}>
                {sessions.map((s) => (
                  <SessionCard key={s.id} session={s} viewMode={sessionViewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEntry && <EntryModal onClose={() => setShowEntry(false)} />}
    </div>
  )
}
