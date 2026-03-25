import { Eye, CircleDollarSign, Activity, Gauge } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useCapacity } from '@/hooks/useCapacity'
import { useLiveClock } from '@/hooks/useLiveClock'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import LiveFeedTable from '@/components/dashboard/LiveFeedTable'
import DailySummary from '@/components/dashboard/DailySummary'

export default function OwnerHome() {
  const sessions = useStore((s) => s.sessions)
  const history  = useStore((s) => s.history)
  const dailyStats = useStore((s) => s.dailyStats)
  const parkingLoading = useStore((s) => s.parkingLoading)
  const parkingError = useStore((s) => s.parkingError)
  const clock    = useLiveClock()

  const { pct, status } = useCapacity()
  const totalRevenue = dailyStats?.summary?.totalRevenue ?? history.reduce((acc, h) => acc + (h.rentAmount ?? 0), 0)

  const capacityColor =
    status === 'critical' ? 'rose'  :
    status === 'warning'  ? 'amber' : 'green'

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: 'var(--bg-primary)' }}>
      <PageHeader eyebrow="Admin View" title="Dashboard">
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'var(--sky-dim)', color: 'var(--sky-vivid)', border: '1px solid var(--sky-border)' }}
        >
          {clock}
        </span>
      </PageHeader>

      <div className="with-bottom-nav-padding flex flex-1 flex-col gap-5 px-4 pt-5 sm:px-6 lg:px-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Rent Collected"
            value={`₹${totalRevenue}`}
            sub={`${history.length} settlements`}
            Icon={CircleDollarSign}
            color="green"
          />
          <StatCard
            label="Active Cars"
            value={sessions.length}
            sub="live sessions"
            Icon={Activity}
            color="sky"
          />
          <StatCard
            label="Capacity"
            value={`${pct}%`}
            sub={status}
            Icon={Gauge}
            color={capacityColor}
          />
        </div>

        {parkingLoading && (
          <div
            className="rounded-xl px-3 py-2.5 text-xs"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Syncing live parking data from server...
          </div>
        )}

        {parkingError && (
          <div
            className="rounded-xl px-3 py-2.5 text-xs"
            style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)', color: 'rgb(252 165 165)' }}
          >
            {parkingError}
          </div>
        )}

        {/* Live Feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Live Feed
            </p>
            <div className="ml-auto flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-ring"
                style={{ background: 'var(--green-vivid)' }}
              />
              <span
                className="text-[10px] font-bold"
                style={{ color: 'var(--green-vivid)' }}
              >
                LIVE
              </span>
            </div>
          </div>
          <LiveFeedTable sessions={sessions} />
        </div>

        {/* Daily Summary */}
        <DailySummary sessions={sessions} history={history} />
      </div>
    </div>
  )
}
