export const PALETTE = ['#A8392A', '#C08A2E', '#2F6B5E', '#2F3E6E', '#7B2D3B', '#2D5F7A']

/** Ornamental divider: a line, a lotus-bud diamond, a line. Same API as the old brush stroke. */
export function BrushStroke({ className = '' }) {
  return (
    <svg viewBox="0 0 200 18" className={className} fill="none" aria-hidden="true">
      <path d="M8 9H80M120 9H192" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M100 1L108 9L100 17L92 9Z" fill="currentColor" />
      <path d="M100 5L104 9L100 13L96 9Z" fill="#FBF6EA" />
      <circle cx="86" cy="9" r="2" fill="currentColor" />
      <circle cx="114" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}

/** Gentle curved band between sections, edged with a gold line */
export function WaveDivider({ from, to, flip = false }) {
  return (
    <div className={`relative leading-none ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" className="w-full h-14 md:h-20 block" preserveAspectRatio="none">
        <path d="M0,70 C360,20 1080,20 1440,70 L1440,90 L0,90 Z" fill={to} />
        <path d="M0,70 C360,20 1080,20 1440,70" stroke={from} strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

export function Blob({ color, className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-[0.12] pointer-events-none ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  )
}

/* Temple-border band: gold diamonds on maroon, like a silk saree edge */
const BORDER_SVG = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='12'>" +
    "<rect width='24' height='12' fill='#7B2D3B'/>" +
    "<rect y='0' width='24' height='1.5' fill='#C08A2E'/><rect y='10.5' width='24' height='1.5' fill='#C08A2E'/>" +
    "<path d='M12 3 L15 6 L12 9 L9 6 Z' fill='#C08A2E'/>" +
    "<circle cx='0' cy='6' r='1.2' fill='#E2BF7A'/><circle cx='24' cy='6' r='1.2' fill='#E2BF7A'/>" +
  "</svg>"
)

export function TapeStrip({ className = '' }) {
  return (
    <div
      className={`h-3 ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,${BORDER_SVG}")`, backgroundRepeat: 'repeat-x' }}
      aria-hidden="true"
    />
  )
}

/** Faint lotus mandala / chakra, drawn from rings of petals */
export function Mandala({ className = '', color = 'currentColor' }) {
  const rings = [
    { n: 8, r: 18, len: 22, w: 8 },
    { n: 16, r: 42, len: 26, w: 7 },
    { n: 24, r: 72, len: 24, w: 6 },
    { n: 32, r: 100, len: 18, w: 4 },
  ]
  return (
    <svg viewBox="-130 -130 260 260" className={className} fill="none" stroke={color} strokeWidth="0.9" aria-hidden="true">
      <circle r="10" />
      {rings.map((ring) =>
        Array.from({ length: ring.n }, (_, i) => {
          const a = (360 / ring.n) * i
          const { r, len, w } = ring
          return (
            <path
              key={`${ring.n}-${i}`}
              transform={`rotate(${a})`}
              d={`M0 ${-r} C${w} ${-r - len * 0.35} ${w * 0.6} ${-r - len * 0.8} 0 ${-r - len} C${-w * 0.6} ${-r - len * 0.8} ${-w} ${-r - len * 0.35} 0 ${-r} Z`}
            />
          )
        })
      )}
      <circle r="66" />
      <circle r="96" />
      <circle r="122" strokeDasharray="2 4" />
    </svg>
  )
}

/** Warm-paper page header with handwritten eyebrow + display title + brush underline */
export function PageHeader({ eyebrow, eyebrowColor = 'text-paint-coral', title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-paper pt-12 pb-10 md:pt-16 md:pb-12">
      <Blob color="#A8392A" className="top-[-7rem] right-[-5rem] w-[22rem] h-[22rem]" />
      <Blob color="#2F3E6E" className="bottom-[-9rem] left-[-6rem] w-[24rem] h-[24rem]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] max-w-none pointer-events-none">
        <Mandala className="w-full h-full text-paint-marigold/25 animate-spin-slow" />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl mx-auto">
        {eyebrow && (
          <p className={`font-hand text-2xl md:text-3xl ${eyebrowColor} mb-1`}>{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl md:text-6xl font-black text-ink">{title}</h1>
        <BrushStroke className="w-28 h-4 text-paint-teal mx-auto mt-3" />
        {subtitle && <p className="mt-5 text-ink/70 text-lg max-w-2xl mx-auto">{subtitle}</p>}
        {children}
      </div>
      <TapeStrip className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}

/** Centered section heading with eyebrow + brush underline */
export function SectionHeading({ eyebrow, eyebrowColor = 'text-paint-violet', title, className = '' }) {
  return (
    <div className={`text-center max-w-2xl mx-auto mb-12 ${className}`}>
      {eyebrow && <p className={`font-hand text-2xl ${eyebrowColor}`}>{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-1">{title}</h2>
      <BrushStroke className="w-28 h-4 text-paint-marigold mx-auto mt-4" />
    </div>
  )
}

/** Primary action button — dark pill that turns coral on hover */
export function PrimaryButton({ as = 'a', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`px-7 py-3.5 bg-ink text-paper rounded-full font-bold tracking-wide hover:bg-paint-coral transition-all duration-300 shadow-lg hover:shadow-paint-coral/40 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

/** Secondary action button — white pill with soft border */
export function GhostButton({ as = 'a', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`px-7 py-3.5 bg-white text-ink rounded-full font-bold tracking-wide border-2 border-ink/10 hover:border-ink transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export const inputClass =
  'w-full border border-ink/10 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-paint-teal focus:border-transparent outline-none transition'
export const labelClass = 'block text-sm font-semibold text-ink/80 mb-1.5'
export const cardClass = 'bg-white rounded-2xl shadow-sm border border-paint-marigold/30'