import { Car } from 'lucide-react'

/**
 * Renders the correct Lucide icon for a vehicle type.
 * @param {{ type: 'Car', className?: string }} props
 */
export default function VehicleIcon({ type, className = 'w-4 h-4' }) {
  return <Car className={className} />
}
