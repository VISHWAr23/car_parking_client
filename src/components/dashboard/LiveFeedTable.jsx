import { Camera, MapPin, Clock } from 'lucide-react'
import VehicleIcon from '@/components/ui/VehicleIcon'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { calculateParkingDays, calculateRentAmount } from '@/utils'

/**
 * Table of all active sessions — shown on Owner dashboard.
 * @param {{ sessions: object[] }} props
 */
export default function LiveFeedTable({ sessions }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      {/* Table head */}
      <div
        className="grid grid-cols-[44px_1fr_auto] gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]"
        style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span>Photo</span>
        <span>Vehicle</span>
        <span className="text-right">Since</span>
      </div>

      {sessions.length === 0 && (
        <div style={{ background: 'var(--bg-surface)' }}>
          <EmptyState title="No active sessions" description="New entries will appear here live" />
        </div>
      )}

      {sessions.map((s, i) => {
        const typeVariant = 'sky'
        const parkedDays = calculateParkingDays(s.entryDate)
        const projectedRent = calculateRentAmount(s.entryDate, s.rentPerDay)

        return (
          <div
            key={s.id}
            className="grid grid-cols-[44px_1fr_auto] gap-3 items-center px-4 py-3.5 animate-fade-in"
            style={{
              background:   'var(--bg-surface)',
              borderBottom: i < sessions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            {/* Thumbnail */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[var(--text-muted)]"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <Camera className="w-4 h-4" />
            </div>

            {/* Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-xs tracking-widest text-[var(--text-primary)] truncate">
                  {s.plate}
                </span>
                <Badge variant={typeVariant}>{s.type}</Badge>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mb-1 truncate">{s.customerName}</p>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <MapPin className="w-2.5 h-2.5" />{s.slot}
                </span>
                <span className="text-[var(--border-strong)]">·</span>
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <VehicleIcon type={s.type} className="w-2.5 h-2.5" />₹{projectedRent}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold text-[var(--text-secondary)]">{s.entryTime}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{parkedDays} day{parkedDays > 1 ? 's' : ''}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
