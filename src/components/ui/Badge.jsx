import { cx } from '@/utils'

const variants = {
  green: 'badge-green',
  rose:  'badge-rose',
  amber: 'badge-amber',
  sky:   'badge-sky',
}

/**
 * @param {{ variant?: 'green'|'rose'|'amber'|'sky', children: React.ReactNode, className?: string }} props
 */
export default function Badge({ variant = 'green', children, className }) {
  return (
    <span className={cx('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
