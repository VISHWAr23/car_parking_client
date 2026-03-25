import { format } from 'date-fns'
import { BILLING_CYCLE_DAYS, MONTHLY_RENT_PER_CAR } from '@/constants'

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

/** Calculate prorated rent using fixed monthly plan (rounded to nearest rupee). */
export const calculateRentAmount = (
  entryDate,
  monthlyRent = MONTHLY_RENT_PER_CAR,
  exitDate = new Date(),
) => {
  const parkedDays = calculateParkingDays(entryDate, exitDate)
  return Math.round((parkedDays * monthlyRent) / BILLING_CYCLE_DAYS)
}

/** Merge class names (lightweight clsx-style) */
export const cx = (...classes) =>
  classes.filter(Boolean).join(' ')

/** Generate unique ID */
export const uid = () =>
  Math.random().toString(36).slice(2, 9)

/** Capitalize first letter */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)
