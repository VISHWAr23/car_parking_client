export const TOTAL_SLOTS = 20

export const VEHICLE_TYPES = ['Car']

const parsedDailyRent = Number(import.meta.env.VITE_DAILY_RENT)
export const DAILY_RENT_PER_DAY = Number.isFinite(parsedDailyRent) && parsedDailyRent > 0
  ? parsedDailyRent
  : 250

export const ROLES = {
  LABORER: 'laborer',
  OWNER:   'owner',
}

export const TABS = {
  HOME:     'home',
  HISTORY:  'history',
  SETTINGS: 'settings',
}

export const SLOT_ZONES = ['A', 'B', 'C', 'D']

/** Generate a slot label from total sessions count */
export const generateSlot = (count) => {
  const zone  = SLOT_ZONES[Math.floor(count / 5) % SLOT_ZONES.length]
  const num   = String((count % 5) + 1).padStart(2, '0')
  return `${zone}-${num}`
}
