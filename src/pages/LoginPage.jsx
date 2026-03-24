import { useState } from 'react'
import {
  ArrowRight,
  CircleAlert,
  KeyRound,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cx } from '@/utils'

export default function LoginPage() {
  const login = useStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const clearError = () => setError('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.')
      return
    }

    setLoading(true)
    const result = await login({ username, password })
    setLoading(false)

    if (!result.success) {
      setError(result.message)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="pointer-events-none absolute -left-28 -top-24 h-[24rem] w-[24rem] rounded-full blur-3xl"
        style={{ background: 'rgba(59,130,246,0.18)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-28 right-0 h-[23rem] w-[23rem] rounded-full blur-3xl"
        style={{ background: 'rgba(16,185,129,0.17)' }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-8 sm:px-6">
        <section
          className="w-full rounded-3xl p-6 sm:p-8"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.34), 0 0 0 1px rgba(255,255,255,0.02) inset',
          }}
        >
          <div className="mb-5 flex justify-center">
            <div
              className="rounded-2xl p-2.5"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.32)',
              }}
            >
              <img
                src="/parkos-logo.svg"
                alt="ParkOS logo"
                className="h-14 w-14 sm:h-16 sm:w-16"
              />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-[var(--text-primary)]">Welcome Back</p>
              <p className="text-xs text-[var(--text-muted)]">Sign in to continue</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Username
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    clearError()
                  }}
                  placeholder="Enter username"
                  className="input-field pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    clearError()
                  }}
                  placeholder="Enter password"
                  className="input-field pl-10"
                  type="password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-rose-300"
                style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
              >
                <CircleAlert className="h-4 w-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cx(
                'mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all',
                loading
                  ? 'cursor-wait bg-emerald-700 text-emerald-200'
                  : 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 active:scale-[0.99]',
              )}
            >
              {loading ? 'Signing in...' : 'Login'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
