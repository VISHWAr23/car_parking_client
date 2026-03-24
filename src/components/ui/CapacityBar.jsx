import { cx } from '@/utils'

/**
 * Visual fill bar showing parking capacity.
 * @param {{ pct: number, status: 'normal'|'warning'|'critical' }} props
 */
export default function CapacityBar({ pct, status }) {
  const fillClass =
    status === 'critical' ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
    status === 'warning'  ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                            'bg-gradient-to-r from-emerald-500 to-green-400'

  return (
    <div className="fill-bar">
      <div
        className={cx('fill-bar__inner', fillClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
