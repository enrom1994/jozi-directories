import Link from 'next/link'

export default function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const cls = [
    variant === 'primary' ? 'btn-primary' : '',
    variant === 'ghost'   ? 'btn-ghost'   : '',
    variant === 'outline' ? 'btn-outline' : '',
    className,
  ].filter(Boolean).join(' ')

  if (href) {
    return <Link href={href} className={cls} {...props}>{children}</Link>
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
