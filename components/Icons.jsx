export function IconPhone({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2.5C2 2.2 2.2 2 2.5 2h2.4c.26 0 .48.18.53.44l.7 3.5a.54.54 0 0 1-.27.57l-1.2.67a8.1 8.1 0 0 0 4.16 4.16l.67-1.2a.54.54 0 0 1 .57-.27l3.5.7c.26.05.44.27.44.53V13.5c0 .28-.22.5-.5.5C6.1 14 2 9.9 2 2.5Z"/>
    </svg>
  )
}
export function IconGlobe({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/>
      <path d="M2 8h12M8 2c-1.5 2-2.5 4-2.5 6s1 4 2.5 6M8 2c1.5 2 2.5 4 2.5 6s-1 4-2.5 6"/>
    </svg>
  )
}
export function IconMapPin({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 14s-5-4.686-5-8a5 5 0 0 1 10 0c0 3.314-5 8-5 8Z"/>
      <circle cx="8" cy="6" r="1.5"/>
    </svg>
  )
}
export function IconStar({ size = 13, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.545 3.13L13 5.635l-2.5 2.436.59 3.44L8 9.77l-3.09 1.74.59-3.44L3 5.635l3.455-.505Z"/>
    </svg>
  )
}
export function IconArrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  )
}
export function IconCheck({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l3.5 3.5L13 4.5"/>
    </svg>
  )
}
export function IconX({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 8M12 4l-8 8"/>
    </svg>
  )
}
export function IconExternal({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"/>
      <path d="M10 2h4v4M14 2l-7 7"/>
    </svg>
  )
}
