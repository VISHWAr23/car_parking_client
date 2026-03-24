import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { TOTAL_SLOTS } from '@/constants'

/**
 * Returns derived capacity data from the global store.
 */
export function useCapacity() {
  const sessions = useStore((s) => s.sessions)

  return useMemo(() => {
    const occupied = sessions.length
    const free     = TOTAL_SLOTS - occupied
    const pct      = Math.round((occupied / TOTAL_SLOTS) * 100)
    const status   =
      pct >= 90 ? 'critical' :
      pct >= 70 ? 'warning'  :
                  'normal'

    return { occupied, free, total: TOTAL_SLOTS, pct, status }
  }, [sessions])
}
