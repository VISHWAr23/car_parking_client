import { format } from 'date-fns'

/** Format a Date to "HH:mm a" string */
export const formatTime = (date = new Date()) =>
  format(date, 'hh:mm aa')

/** Format a Date to "dd MMM yyyy" string */
export const formatDate = (date = new Date()) =>
  format(date, 'dd MMM yyyy')

/** Compute duration string between two Date objects */
export const computeDuration = (entryDate) => {
  const diffMs  = Date.now() - entryDate.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const h       = Math.floor(diffMin / 60)
  const m       = diffMin % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

/** Compute inclusive parked days (minimum 1 day) */
export const calculateParkingDays = (entryDate, exitDate = new Date()) => {
  const start = new Date(entryDate).getTime()
  const end = new Date(exitDate).getTime()
  const dayMs = 1000 * 60 * 60 * 24
  return Math.max(1, Math.ceil((end - start) / dayMs))
}

/** Calculate rent by parked days and daily rate */
export const calculateRentAmount = (entryDate, dailyRate, exitDate = new Date()) =>
  calculateParkingDays(entryDate, exitDate) * dailyRate

/** Merge class names (lightweight clsx-style) */
export const cx = (...classes) =>
  classes.filter(Boolean).join(' ')

/** Generate unique ID */
export const uid = () =>
  Math.random().toString(36).slice(2, 9)

/** Capitalize first letter */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)
