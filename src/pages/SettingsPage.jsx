import { useState } from 'react'
import { CircleAlert, CircleCheck, LockKeyhole, LogOut, Shield, UserCircle2, UserPlus } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { ROLES } from '@/constants'
import { useCapacity } from '@/hooks/useCapacity'
import PageHeader from '@/components/layout/PageHeader'
import Badge from '@/components/ui/Badge'
import { cx } from '@/utils'

function SettingRow({ Icon, label, value, color = 'text-[var(--text-secondary)]' }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-[var(--text-muted)]" />
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      </div>
      <span className={cx('text-sm font-semibold', color)}>{value}</span>
    </div>
  )
}

export default function SettingsPage() {
  const role = useStore((s) => s.role)
  const currentUser = useStore((s) => s.currentUser)
  const logout = useStore((s) => s.logout)
  const createLaborer = useStore((s) => s.createLaborer)
  const { occupied, total, pct } = useCapacity()

  const [laborerUsername, setLaborerUsername] = useState('')
  const [laborerPassword, setLaborerPassword] = useState('')
  const [laborerConfirmPassword, setLaborerConfirmPassword] = useState('')
  const [laborerError, setLaborerError] = useState('')
  const [laborerSuccess, setLaborerSuccess] = useState('')
  const [creatingLaborer, setCreatingLaborer] = useState(false)

  const roleVariant = role === ROLES.OWNER ? 'sky' : 'green'
  const roleDescription =
    role === ROLES.OWNER
      ? 'Full visibility of revenue, utilization, and live operational feed.'
      : 'Focused vehicle entry and checkout controls for lot-floor execution.'

  const handleCreateLaborer = async (event) => {
    event.preventDefault()
    setLaborerError('')
    setLaborerSuccess('')

    if (!laborerUsername.trim() || !laborerPassword.trim()) {
      setLaborerError('Username and password are required to create a staff account.')
      return
    }

    if (laborerPassword.length < 6) {
      setLaborerError('Staff account password must be at least 6 characters long.')
      return
    }

    if (laborerPassword !== laborerConfirmPassword) {
      setLaborerError('Password confirmation does not match.')
      return
    }

    setCreatingLaborer(true)
    const result = await createLaborer({
      username: laborerUsername.trim(),
      password: laborerPassword,
    })
    setCreatingLaborer(false)

    if (!result.success) {
      setLaborerError(result.message)
      return
    }

    setLaborerUsername('')
    setLaborerPassword('')
    setLaborerConfirmPassword('')
    setLaborerSuccess('Staff account created successfully.')
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PageHeader eyebrow="Configuration" title="Settings" />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-24">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(145deg, rgba(10,18,31,0.92), rgba(12,22,38,0.75))',
            border: '1px solid var(--border-default)',
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
            >
              <UserCircle2 className="h-6 w-6 text-[var(--text-primary)]" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-[var(--text-primary)]">
                {currentUser?.name ?? 'Authenticated User'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">@{currentUser?.username ?? 'session-user'}</p>
            </div>
            <div className="ml-auto">
              <Badge variant={roleVariant}>{role}</Badge>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{roleDescription}</p>
        </div>

        {/* Lot Info */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
            Lot Status
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <SettingRow Icon={Shield} label="Total Capacity"   value={`${total} slots`} />
            <SettingRow Icon={Shield} label="Occupied"         value={occupied}          color="text-emerald-400" />
            <SettingRow Icon={Shield} label="Available"        value={total - occupied}  color="text-sky-400"     />
            <SettingRow Icon={Shield} label="Utilization"      value={`${pct}%`}         color={pct >= 90 ? 'text-rose-400' : 'text-amber-400'} />
          </div>
        </div>

        {role === ROLES.OWNER && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <UserPlus className="h-4 w-4 text-emerald-400" />
              <p className="text-sm text-[var(--text-primary)] font-semibold">Staff Management</p>
              <span className="ml-auto text-xs text-[var(--text-muted)] uppercase tracking-widest">Owner only</span>
            </div>
            <form className="p-4 space-y-3" onSubmit={handleCreateLaborer}>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                  Staff Username
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. operator_02"
                  value={laborerUsername}
                  onChange={(event) => {
                    setLaborerUsername(event.target.value)
                    setLaborerError('')
                    setLaborerSuccess('')
                  }}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                    Password
                  </label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={laborerPassword}
                    onChange={(event) => {
                      setLaborerPassword(event.target.value)
                      setLaborerError('')
                      setLaborerSuccess('')
                    }}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                    Confirm Password
                  </label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Re-enter password"
                    value={laborerConfirmPassword}
                    onChange={(event) => {
                      setLaborerConfirmPassword(event.target.value)
                      setLaborerError('')
                      setLaborerSuccess('')
                    }}
                  />
                </div>
              </div>

              {laborerError && (
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-rose-300"
                  style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
                >
                  <CircleAlert className="h-4 w-4" />
                  {laborerError}
                </div>
              )}

              {laborerSuccess && (
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-emerald-300"
                  style={{ background: 'var(--green-dim)', border: '1px solid var(--green-border)' }}
                >
                  <CircleCheck className="h-4 w-4" />
                  {laborerSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={creatingLaborer}
                className={cx(
                  'w-full rounded-xl px-4 py-3.5 text-sm font-bold transition-all',
                  creatingLaborer
                    ? 'cursor-wait bg-emerald-700 text-emerald-200'
                    : 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 active:scale-[0.99]',
                )}
              >
                {creatingLaborer ? 'Creating staff account...' : 'Create Staff Account'}
              </button>
            </form>
          </div>
        )}

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <LockKeyhole className="h-4 w-4 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">Security</p>
            <span className="ml-auto text-xs font-semibold text-emerald-400">Role-scoped access active</span>
          </div>
          <div className="p-4">
            <button
              onClick={logout}
              className="w-full rounded-xl px-4 py-3.5 text-sm font-bold transition-colors text-rose-300 hover:text-rose-200"
              style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign out securely
              </span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--green-dim)', border: '1px solid var(--green-border)' }}
            >
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)]">ParkOS</p>
              <p className="text-xs text-[var(--text-muted)]">Private Parking Management System · v1.0.0</p>
            </div>
          </div>
          <div
            className="px-4 py-3"
            style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Built for private lot operators. Your authenticated role controls the experience and access scope for this session.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
