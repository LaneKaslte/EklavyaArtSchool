import { useId } from 'react'

// Mahabharat palette: saffron, temple gold, peacock, royal maroon, lotus, Krishna blue
export const PALETTE = ['#D9631E', '#C8962E', '#1D6A72', '#8C1C33', '#C24E72', '#2C4F8C']

const GOLD = '#C8962E'
const MAROON = '#8C1C33'
const SAFFRON = '#D9631E'

/**
 * Ornamental divider: an arrow (for Eklavya, the archer) with a diamond at its centre.
 * Kept under its old name so existing call sites need no changes. Colour comes from `currentColor`.
 */
export function BrushStroke({ className = '' }) {
  return (
    <svg viewBox="0 0 200 18" className={className} fill="currentColor" aria-hidden="true" preserveAspectRatio="none">
      {/* fletching */}
      <path d="M2 2 L16 8 L10 8 Z M2 16 L16 10 L10 10 Z M10 2 L24 8 L18 8 Z M10 16 L24 10 L18 10 Z" />
      {/* shaft */}
      <rect x="14" y="8" width="172" height="2" rx="1" />
      {/* centre jewel */}
      <path d="M100 2.5 L106.5 9 L100 15.5 L93.5 9 Z" />
      <circle cx="86" cy="9" r="2" />
      <circle cx="114" cy="9" r="2" />
      {/* arrowhead */}
      <path d="M182 2.5 L199 9 L182 15.5 L186.5 9 Z" />
    </svg>
  )
}

/** Row of temple arches between two sections, edged with a gold line */
export function WaveDivider({ from, to, flip = false }) {
  const arch = 80
  const count = 1440 / arch
  let d = 'M0,90 L0,56'
  for (let i = 0; i < count; i++) d += ` Q${i * arch + arch / 2},4 ${(i + 1) * arch},56`
  const edge = d.replace('M0,90 L0,56', 'M0,56')
  d += ' L1440,90 Z'

  return (
    <div
      className={`relative leading-none ${flip ? 'rotate-180' : ''}`}
      style={{ backgroundColor: from }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 90" className="w-full h-10 md:h-14 block" preserveAspectRatio="none">
        <path d={d} fill={to} />
        <path d={edge} stroke={GOLD} strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

export function Blob({ color, className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  )
}

/** Toran: a gold band with hanging saffron and maroon pennants, like a festive doorway garland */
export function TapeStrip({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`block w-full h-3 ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`toran-${id}`} width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 3 L6 11 L12 3 Z" fill={SAFFRON} />
          <path d="M12 3 L18 11 L24 3 Z" fill={MAROON} />
          <rect width="24" height="3.5" fill={GOLD} />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill={`url(#toran-${id})`} />
    </svg>
  )
}

/** Faint wheel (chakra) with 24 spokes, used as a backdrop behind headings */
export function Chakra({ className = '' }) {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15)
  return (
    <svg viewBox="0 0 200 200" className={`pointer-events-none ${className}`} fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="100" cy="100" r="96" strokeWidth="3" />
      <circle cx="100" cy="100" r="86" strokeWidth="1" />
      <circle cx="100" cy="100" r="14" strokeWidth="3" />
      {spokes.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 100 100)`}>
          <line x1="100" y1="14" x2="100" y2="86" strokeWidth="1.5" />
          <circle cx="100" cy="91" r="2.5" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  )
}

/** Parchment page header with eyebrow, display title and arrow divider */
export function PageHeader({ eyebrow, eyebrowColor = 'text-paint-coral', title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-paper pt-12 pb-12 md:pt-16 md:pb-14">
      <Blob color={SAFFRON} className="top-[-7rem] right-[-5rem] w-[22rem] h-[22rem]" />
      <Blob color={MAROON} className="bottom-[-9rem] left-[-6rem] w-[24rem] h-[24rem]" />
      <Chakra className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] text-paint-marigold opacity-[0.12]" />
      <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
        {eyebrow && <p className={`font-hand text-2xl md:text-3xl ${eyebrowColor} mb-2`}>{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-6xl font-black text-ink tracking-wide">{title}</h1>
        <BrushStroke className="w-40 h-4 text-paint-marigold mx-auto mt-4" />
        {subtitle && <p className="mt-5 text-ink/70 text-lg max-w-2xl mx-auto">{subtitle}</p>}
        {children}
      </div>
      <TapeStrip className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}

/** Centered section heading with eyebrow and arrow divider */
export function SectionHeading({ eyebrow, eyebrowColor = 'text-paint-violet', title, className = '' }) {
  return (
    <div className={`text-center max-w-2xl mx-auto mb-12 ${className}`}>
      {eyebrow && <p className={`font-hand text-2xl ${eyebrowColor}`}>{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-1 tracking-wide">{title}</h2>
      <BrushStroke className="w-36 h-4 text-paint-marigold mx-auto mt-4" />
    </div>
  )
}

/** Primary action button: maroon-brown pill with a gold rim that turns saffron on hover */
export function PrimaryButton({ as = 'a', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`px-7 py-3.5 bg-ink text-paper rounded-full font-bold tracking-wide ring-2 ring-paint-marigold/60 hover:bg-paint-coral transition-all duration-300 shadow-lg hover:shadow-paint-coral/40 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

/** Secondary action button: light pill with a gold border */
export function GhostButton({ as = 'a', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`px-7 py-3.5 bg-white text-ink rounded-full font-bold tracking-wide border-2 border-paint-marigold/50 hover:border-ink transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export const inputClass =
  'w-full border border-paint-marigold/30 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-paint-marigold focus:border-transparent outline-none transition'
export const labelClass = 'block text-sm font-bold text-ink/80 mb-1.5'
export const cardClass = 'bg-white rounded-[2rem] shadow-sm border border-paint-marigold/30'
