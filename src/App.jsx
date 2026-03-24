import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { ROLES, TABS } from '@/constants'
import BottomNav from '@/components/layout/BottomNav'
import LaborerHome from '@/pages/LaborerHome'
import OwnerHome   from '@/pages/OwnerHome'
import HistoryPage from '@/pages/HistoryPage'
import SettingsPage from '@/pages/SettingsPage'
import LoginPage from '@/pages/LoginPage'

/**
 * Root application shell.
 * Renders the correct page based on (role, tab) from global store.
 * All routing is client-side state — no react-router needed for this scope.
 */
export default function App() {
  const role = useStore((s) => s.role)
  const tab  = useStore((s) => s.tab)
  const isAuthenticated = useStore((s) => s.isAuthenticated)
  const authLoading = useStore((s) => s.authLoading)
  const parkingError = useStore((s) => s.parkingError)
  const bootstrapAuth = useStore((s) => s.bootstrapAuth)
  const roleLabel = role === ROLES.OWNER ? 'Owner' : 'Operator'

  useEffect(() => {
    bootstrapAuth()
  }, [bootstrapAuth])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl skeleton" />
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Securing session</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderPage = () => {
    if (tab === TABS.HISTORY)  return <HistoryPage />
    if (tab === TABS.SETTINGS) return <SettingsPage />
    if (role === ROLES.OWNER)  return <OwnerHome />
    return <LaborerHome />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="pointer-events-none absolute -top-28 left-0 h-[24rem] w-[24rem] rounded-full blur-3xl"
        style={{ background: 'rgba(16,185,129,0.12)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-[22rem] w-[22rem] rounded-full blur-3xl"
        style={{ background: 'rgba(59,130,246,0.12)' }}
      />

      <div className="relative mx-auto min-h-screen w-full max-w-6xl border-x border-white/[0.04]">
        {/* Role indicator pill — always visible */}
        <div className="fixed right-4 top-3 z-50 pointer-events-none sm:right-6 lg:right-10">
          <span
            className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
            style={
              role === ROLES.OWNER
                ? { background: 'var(--sky-dim)', color: 'var(--sky-vivid)', border: '1px solid var(--sky-border)' }
                : { background: 'var(--green-dim)', color: 'var(--green-vivid)', border: '1px solid var(--green-border)' }
            }
          >
            {roleLabel}
          </span>
        </div>

        {/* Page content */}
        {parkingError && (
          <div
            className="mx-4 mt-3 rounded-xl px-3 py-2 text-xs"
            style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)', color: 'rgb(252 165 165)' }}
          >
            {parkingError}
          </div>
        )}

        {renderPage()}

        {/* Persistent bottom navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
