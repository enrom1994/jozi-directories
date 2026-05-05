import Link from 'next/link'

export default function Pill({ label, count, href }) {
  return (
    <Link href={href} className="cat-pill">
      <span className="cat-pill-name">{label}</span>
      {count != null && <span className="cat-pill-count">{count}</span>}
    </Link>
  )
}
