import { useState } from 'react'
import { X, LogIn, FileImage, AlertCircle, CircleCheck } from 'lucide-react'
import { DAILY_RENT_PER_DAY } from '@/constants'
import { useStore } from '@/store/useStore'
import { cx } from '@/utils'

const PHOTO_SIDES = [
  { key: 'front', label: 'Front View' },
  { key: 'rear', label: 'Rear View' },
  { key: 'left', label: 'Left Side' },
  { key: 'right', label: 'Right Side' },
]

const toPhotoMeta = (file) => (file ? { name: file.name, url: URL.createObjectURL(file) } : null)

export default function EntryModal({ onClose }) {
  const addSession = useStore((s) => s.addSession)

  const [plate, setPlate] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [rcBookPhoto, setRcBookPhoto] = useState(null)
  const [carPhotos, setCarPhotos] = useState({ front: null, rear: null, left: null, right: null })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const optionalPhotoCount = Object.values(carPhotos).filter(Boolean).length

  const validate = () => {
    if (!customerName.trim()) return 'Owner name is required.'
    if (!phoneNumber.trim()) return 'Phone number is required.'
    if (!/^\d{10,15}$/.test(phoneNumber.trim())) return 'Enter a valid phone number (10-15 digits).'
    if (!plate.trim()) return 'Car number is required.'
    if (plate.trim().length < 4) return 'Enter a valid car number.'
    if (!rcBookPhoto) return 'RC book photo is required.'
    return null
  }

  const handleSidePhoto = (side, file) => {
    setCarPhotos((prev) => ({
      ...prev,
      [side]: toPhotoMeta(file),
    }))
    setError('')
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 550))

    const success = addSession({
      plate,
      customerName,
      phoneNumber,
      rcBookPhoto: rcBookPhoto.name,
      carPhotos,
    })

    setLoading(false)

    if (!success) {
      setError('Parking lot is full. No available slots for new entry.')
      return
    }

    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in sm:items-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="max-h-[92vh] w-full overflow-auto rounded-t-3xl sm:max-w-2xl sm:rounded-2xl animate-slide-up"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full" style={{ background: 'var(--border-strong)' }} />
        </div>

        <div className="px-5 pb-7 pt-3 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
                <LogIn className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold leading-none text-[var(--text-primary)]">
                  New Car Entry
                </h2>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Monthly billing is based on parked days
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Owner Name
              </label>
              <input
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value)
                  setError('')
                }}
                placeholder="Enter owner name"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Phone Number
              </label>
              <input
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value.replace(/[^\d]/g, ''))
                  setError('')
                }}
                placeholder="10-15 digit number"
                className="input-field"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Car Number
            </label>
            <input
              value={plate}
              onChange={(event) => {
                setPlate(event.target.value.toUpperCase())
                setError('')
              }}
              placeholder="MH 12 AB 3456"
              maxLength={14}
              className="input-field font-mono uppercase tracking-widest"
              style={{ letterSpacing: '0.09em' }}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              RC Book Photo (Required)
            </label>
            <label
              className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3.5"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)' }}
            >
              <span className="text-sm text-[var(--text-secondary)] truncate pr-3">
                {rcBookPhoto ? rcBookPhoto.name : 'Upload RC book image'}
              </span>
              <span className="text-xs font-semibold text-emerald-400">Choose File</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  setRcBookPhoto(event.target.files?.[0] ?? null)
                  setError('')
                }}
              />
            </label>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Car Photos (Optional)
              </label>
              <span className="text-[10px] text-[var(--text-muted)]">{optionalPhotoCount}/4 uploaded</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {PHOTO_SIDES.map((side) => (
                <label
                  key={side.key}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileImage className="h-4 w-4 text-[var(--text-muted)]" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{side.label}</p>
                      <p className="truncate text-[10px] text-[var(--text-muted)]">
                        {carPhotos[side.key]?.name ?? 'Not uploaded'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleSidePhoto(side.key, event.target.files?.[0])}
                  />
                </label>
              ))}
            </div>
          </div>

          <div
            className="mb-4 rounded-xl px-4 py-3"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Daily Rent Policy</span>
              <span className="font-display text-sm font-bold text-emerald-400">₹{DAILY_RENT_PER_DAY} / day</span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)] leading-relaxed">
              Final rent is calculated by parked days and collected at month-end or at exit.
            </p>
          </div>

          {error && (
            <div
              className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-rose-400"
              style={{ background: 'var(--rose-dim)', border: '1px solid var(--rose-border)' }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!error && optionalPhotoCount > 0 && (
            <div
              className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-emerald-300"
              style={{ background: 'var(--green-dim)', border: '1px solid var(--green-border)' }}
            >
              <CircleCheck className="h-4 w-4 flex-shrink-0" />
              Optional side photos attached successfully.
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
              style={{ border: '1px solid var(--border-default)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={cx(
                'flex-1 rounded-xl py-3.5 text-sm font-bold transition-all active:scale-[0.98]',
                loading
                  ? 'cursor-wait bg-emerald-700 text-emerald-200'
                  : 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400',
              )}
            >
              {loading ? 'Registering...' : 'Register Car Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
