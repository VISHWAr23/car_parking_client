import { useState, useEffect } from 'react'
import { format } from 'date-fns'

/**
 * Returns a live clock string updated every minute.
 */
export function useLiveClock() {
  const [time, setTime] = useState(() => format(new Date(), 'hh:mm aa'))

  useEffect(() => {
    const tick = () => setTime(format(new Date(), 'hh:mm aa'))
    const id   = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return time
}
