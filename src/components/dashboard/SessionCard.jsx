import { LogOut, Clock, MapPin } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { calculateParkingDays, calculateRentAmount } from '@/utils'
import VehicleIcon from '@/components/ui/VehicleIcon'
import Badge from '@/components/ui/Badge'
import { cx } from '@/utils'

/**
 * Displays a single active parking session row.
 * @param {{ session: object }} props
 */
export default function SessionCard({ session, viewMode = 'list' }) {
  const checkout = useStore((s) => s.checkoutSession)
  const parkedDays = calculateParkingDays(session.entryDate)
  const projectedRent = calculateRentAmount(session.entryDate, session.rentPerDay)
  const frontPhotoUrl = session.carPhotos?.front?.url || null

  const typeVariant = 'sky'

  if (viewMode === 'cards') {
    return (
      <div
        className="rounded-2xl overflow-hidden transition-colors hover:bg-white/[0.02] animate-fade-in"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        <div
          className="h-36 w-full flex items-center justify-center"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          {frontPhotoUrl ? (
            <img src={frontPhotoUrl} alt={`${session.plate} front`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <VehicleIcon type={session.type} className="w-8 h-8" />
              <span className="text-[11px]">No front image</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[var(--text-primary)] truncate">{session.customerName}</span>
            <Badge variant={typeVariant}>{session.type}</Badge>
          </div>
          <p className="font-mono text-xs tracking-widest text-[var(--text-secondary)] truncate">{session.plate}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">+91 {session.phoneNumber}</p>

          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <MapPin className="w-3 h-3" />
              {session.slot}
            </span>
            <span className="text-[var(--border-strong)]">·</span>
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Clock className="w-3 h-3" />
              {parkedDays} day{parkedDays > 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-xs text-emerald-300 mt-2">Projected rent ₹{projectedRent}</p>

          <button
            onClick={() => checkout(session.id)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-rose-400 text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95"
            style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit & Bill
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors hover:bg-white/[0.02] animate-fade-in"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-400"
        style={{ background: 'var(--green-dim)', border: '1px solid var(--green-border)' }}
      >
        <VehicleIcon type={session.type} className="w-5 h-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
            {session.customerName}
          </span>
          <span className="text-[var(--border-strong)]">·</span>
          <span className="font-mono font-semibold text-xs tracking-widest text-[var(--text-secondary)] truncate">
            {session.plate}
          </span>
          <Badge variant={typeVariant}>{session.type}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
            <MapPin className="w-3 h-3" />
            {session.slot}
          </span>
          <span className="text-[var(--border-strong)]">·</span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
            <Clock className="w-3 h-3" />
            {parkedDays} day{parkedDays > 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">
          +91 {session.phoneNumber} · Projected rent ₹{projectedRent}
        </p>
      </div>

      {/* Checkout */}
      <button
        onClick={() => checkout(session.id)}
        className={cx(
          'flex items-center gap-1.5 text-rose-400 text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 flex-shrink-0',
        )}
        style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
      >
        <LogOut className="w-3.5 h-3.5" />
        Exit & Bill
      </button>
    </div>
  )
}
