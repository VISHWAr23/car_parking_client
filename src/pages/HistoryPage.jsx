import { History, MapPin, Clock, ArrowRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import PageHeader from '@/components/layout/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import VehicleIcon from '@/components/ui/VehicleIcon'

export default function HistoryPage() {
  const history = useStore((s) => s.history)

  const totalToday = history.reduce((acc, h) => acc + (h.rentAmount ?? 0), 0)

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PageHeader eyebrow="Session Log" title="History">
        {history.length > 0 && (
          <div
            className="px-3 py-1.5 rounded-xl text-right"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">Settled Rent</p>
            <p className="font-display font-bold text-emerald-400 text-sm leading-tight">₹{totalToday}</p>
          </div>
        )}
      </PageHeader>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-2.5 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-24">
        {history.length === 0 && (
          <EmptyState
            Icon={History}
            title="No completed sessions"
            description="Checked-out vehicles will appear here"
          />
        )}

        {history.map((h) => {
          const typeVariant = 'sky'

          return (
            <div
              key={h.id}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl animate-fade-in"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-rose-400"
                style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
              >
                <VehicleIcon type={h.type} className="w-5 h-5" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-semibold text-sm tracking-widest text-[var(--text-primary)] truncate">
                    {h.plate}
                  </span>
                  <Badge variant={typeVariant}>{h.type}</Badge>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mb-1 truncate">
                  {h.customerName} · {h.phoneNumber}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <MapPin className="w-2.5 h-2.5" />
                    {h.slot}
                  </span>
                  <span className="text-[var(--border-strong)]">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <Clock className="w-2.5 h-2.5" />
                    {h.entryTime}
                    <ArrowRight className="w-2.5 h-2.5 mx-0.5" />
                    {h.exitTime}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  {h.parkedDays ?? 1} day{(h.parkedDays ?? 1) > 1 ? 's' : ''} @ ₹{h.rentPerDay ?? 0}/day
                </p>
              </div>

              {/* Fee */}
              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-emerald-400 text-base">₹{h.rentAmount ?? 0}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
