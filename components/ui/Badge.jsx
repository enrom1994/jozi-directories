export default function Badge({ variant = 'accent', children }) {
  const cls =
    variant === 'green'   ? 'badge badge-green'   :
    variant === 'neutral' ? 'badge badge-neutral'  :
    'badge badge-gold' // default: terracotta accent (--gold token)

  return <span className={cls}>{children}</span>
}
