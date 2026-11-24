import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import './legend.css'

/* Small seeded RNG so the forest and stars look the same on every visit */
function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function treeline(seed, baseY, minH, maxH, step) {
  const r = rng(seed)
  let d = `M0 600 L0 ${baseY}`
  for (let x = 0; x <= 1440; x += step) {
    const h = minH + r() * (maxH - minH)
    d += ` L${x + step * 0.5} ${baseY - h} L${x + step} ${baseY - r() * 14}`
  }
  return d + ' L1440 600 Z'
}

function ForestScene() {
  const { far, mid, near, stars } = useMemo(() => {
    const r = rng(7)
    return {
      far: treeline(3, 470, 30, 90, 38),
      mid: treeline(11, 520, 40, 120, 54),
      near: treeline(23, 575, 50, 150, 72),
      stars: Array.from({ length: 70 }, () => ({
        x: r() * 1440,
        y: r() * 300,
        s: 0.6 + r() * 1.4,
        d: r() * 4,
      })),
    }
  }, [])

  return (
    <svg className="lg-scene" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {stars.map((s, i) => (
        <circle
          key={i}
          className="lg-star"
          cx={s.x}
          cy={s.y}
          r={s.s}
          fill="#f1e6cf"
          style={{ animationDelay: `${s.d}s` }}
        />
      ))}
      <circle cx="1160" cy="110" r="46" fill="#f1e6cf" opacity="0.92" />
      <circle cx="1178" cy="98" r="44" fill="#1c2c23" opacity="0.9" />
      <path d={far} fill="#22352b" />
      <path d={mid} fill="#192820" />

      {/* target on a tree trunk, struck by the arrow */}
      <g className="lg-target">
        <rect x="1006" y="380" width="14" height="200" fill="#130f0c" />
        <circle cx="1013" cy="400" r="40" fill="#f1e6cf" />
        <circle cx="1013" cy="400" r="29" fill="#b4432a" />
        <circle cx="1013" cy="400" r="18" fill="#f1e6cf" />
        <circle cx="1013" cy="400" r="7" fill="#b4432a" />
      </g>
      <g transform="translate(1013 400)">
        <g className="lg-arrow">
          <line x1="-260" y1="0" x2="-4" y2="0" stroke="#e2bf7a" strokeWidth="3" />
          <path d="M-262 0 l-14 -9 h14 l10 9 l-10 9 h-14 Z" fill="#c8963e" />
          <path d="M-4 0 l-12 -6 v12 Z" fill="#e2bf7a" />
        </g>
      </g>

      <path d={near} fill="#0d1511" />
    </svg>
  )
}

/* ---------- chapter vignettes: simple line drawings ---------- */
const stroke = { fill: 'none', stroke: '#9c5f3a', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

const Bow = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M30 10 C70 30 70 70 30 90" {...stroke} />
    <line x1="30" y1="10" x2="30" y2="90" {...stroke} strokeWidth="1.2" />
    <line x1="18" y1="50" x2="88" y2="50" {...stroke} />
    <path d="M88 50 l-8 -5 M88 50 l-8 5" {...stroke} />
    <path d="M18 50 l-6 -6 M18 50 l-6 6 M24 50 l-6 -6 M24 50 l-6 6" {...stroke} strokeWidth="1.4" />
  </svg>
)

const Gate = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M20 90 V45 C20 25 80 25 80 45 V90" {...stroke} />
    <path d="M32 90 V50 C32 38 68 38 68 50 V90" {...stroke} />
    <line x1="12" y1="90" x2="88" y2="90" {...stroke} />
    <path d="M50 22 V12 M44 16 H56" {...stroke} />
    <circle cx="50" cy="66" r="3" fill="#b4432a" />
  </svg>
)

const ClayGuru = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="26" r="10" {...stroke} />
    <path d="M50 16 c-3 -6 3 -6 0 -10" {...stroke} strokeWidth="1.6" />
    <path d="M36 40 C40 36 60 36 64 40 L70 66 H30 Z" {...stroke} />
    <path d="M24 74 C30 66 70 66 76 74 C70 80 30 80 24 74 Z" {...stroke} />
    <rect x="22" y="80" width="56" height="10" rx="2" {...stroke} />
    <path d="M46 26 h.01 M54 26 h.01" {...stroke} strokeWidth="3" />
  </svg>
)

const SevenArrows = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    {[-36, -24, -12, 0, 12, 24, 36].map((a) => (
      <g key={a} transform={`rotate(${a} 50 82)`}>
        <line x1="50" y1="82" x2="50" y2="18" {...stroke} strokeWidth="1.8" />
        <path d="M50 14 l-3 6 h6 Z" fill="#9c5f3a" />
      </g>
    ))}
    <circle cx="50" cy="82" r="4" fill="#b4432a" />
  </svg>
)

const Diya = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 22 C58 34 58 44 50 50 C42 44 42 34 50 22 Z" fill="#c8963e" opacity="0.85" />
    <path d="M50 34 C53 39 53 44 50 47 C47 44 47 39 50 34 Z" fill="#b4432a" />
    <path d="M18 60 C26 78 74 78 82 60 Z" {...stroke} />
    <path d="M18 60 H82" {...stroke} />
    <path d="M38 80 H62" {...stroke} />
  </svg>
)

const CHAPTERS = [
  {
    n: 'I',
    title: 'A son of the forest',
    art: <Bow />,
    text: [
      'Eklavya was the son of Hiranyadhanu, chief of the Nishadas, a tribe of hunters who lived deep in the forests near Hastinapura. He grew up with a bow in his hands and a single wish in his heart: to become the greatest archer in the world.',
    ],
  },
  {
    n: 'II',
    title: 'Turned away at Drona’s gate',
    art: <Gate />,
    text: [
      'He walked to the court of Dronacharya, the royal teacher of the Kaurava and Pandava princes, and touched his feet asking to be taught. Drona looked at the forest boy and refused. His lessons were for princes alone.',
      'Eklavya did not argue. He bowed, and went back into the forest.',
    ],
  },
  {
    n: 'III',
    title: 'The guru made of clay',
    art: <ClayGuru />,
    text: [
      'In a clearing, Eklavya shaped an image of Drona from river clay. Every morning he bowed before it, and every day he practised in front of it, as though his teacher were watching.',
      'There was no one to correct him. He learned by watching, by repeating, by failing and trying again. Season after season, the clay guru looked on while the boy became a master.',
    ],
  },
  {
    n: 'IV',
    title: 'Seven arrows, not a drop of blood',
    art: <SevenArrows />,
    text: [
      'One day the princes came hunting in that forest. Their dog ran ahead and barked at the strange dark-skinned archer. Before it could bark again, Eklavya loosed seven arrows into its open mouth so swiftly and precisely that they silenced it without wounding it.',
      'The princes were astonished. Who could shoot like this? “I am Eklavya,” he told them, “a pupil of Dronacharya.” Arjuna, Drona’s favourite, went back troubled. His teacher had promised that no archer would ever surpass him.',
    ],
  },
  {
    n: 'V',
    title: 'The gurudakshina',
    art: <Diya />,
    text: [
      'Drona came to the forest and found Eklavya, who welcomed him with joy. “If I am your teacher,” Drona said, “you owe me my fee.” Eklavya replied that he would give anything at all.',
      'Drona asked for the thumb of his right hand, the thumb an archer draws the bowstring with. Without a moment’s pause, with a cheerful face, Eklavya cut it off and laid it at his guru’s feet.',
    ],
  },
]

const LESSONS = [
  {
    title: 'Practise when no one is watching',
    text: 'Eklavya had no class, no audience and no praise. Mastery came from showing up every single day. A sketchbook filled quietly at home teaches more than any single lesson.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="20" cy="20" r="16" />
        <circle cx="20" cy="20" r="10" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Learn by looking',
    text: 'He studied his craft by observing closely and copying faithfully. That is how artists have always learned: draw what you actually see, then draw it again.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M3 20 C10 9 30 9 37 20 C30 31 10 31 3 20 Z" />
        <circle cx="20" cy="20" r="5" />
      </svg>
    ),
  },
  {
    title: 'Carry your teacher with you',
    text: 'His guru was a figure of clay, yet it guided every arrow. The habits and respect a good teacher gives you keep working long after the class is over.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="20" cy="11" r="5" />
        <path d="M12 22 C14 18 26 18 28 22 L30 31 H10 Z" />
        <path d="M6 35 H34" />
      </svg>
    ),
  },
]

export default function Legend() {
  return (
    <div className="lg">
      <section className="lg-hero">
        <ForestScene />
        <div className="lg-wrap lg-hero-inner">
          <p className="lg-label">From the Adi Parva of the Mahabharata</p>
          <div style={{ position: 'relative' }}>
            <span className="lg-deva-ghost" aria-hidden="true">एकलव्य</span>
            <h1 className="lg-title">Eklavya</h1>
          </div>
          <p className="lg-title-sub" lang="sa">एकलव्य</p>
          <p className="lg-hero-lede">
            The forest archer who became a master with a teacher made of clay, and the student whose name our
            school carries.
          </p>
        </div>
      </section>

      <div className="lg-wrap">
        <section className="lg-intro">
          <div>
            <p className="lg-label">Why this story</p>
            <h2>A legend about devotion, practice and learning on your own.</h2>
          </div>
          <div className="lg-prose">
            <p>
              Of all the students in the Mahabharata, the most famous never sat in a classroom. Eklavya was
              refused a teacher, so he made one. What he built with his own hands, his own eyes and his own
              daily practice outshone the princes who had everything.
            </p>
            <p>
              Every young artist who has ever copied a drawing late at night, or practised a single line a
              hundred times, has a little Eklavya in them. Here is his story in five parts.
            </p>
          </div>
        </section>

        <div className="lg-rule" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 1 L14 11 L11 21 L8 11 Z" fill="currentColor" /></svg>
        </div>

        <section className="lg-chapters" aria-label="The story in five chapters">
          {CHAPTERS.map((c) => (
            <article className="lg-chapter" key={c.n}>
              <div className="lg-vignette">{c.art}</div>
              <div className="lg-chapter-body">
                <span className="lg-numeral">{c.n}</span>
                <h3>{c.title}</h3>
                {c.text.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>

      <section className="lg-verse">
        <div className="lg-wrap">
          <p className="lg-label">Drona’s request</p>
          <p className="lg-verse-deva" lang="sa">अङ्गुष्ठो दक्षिणो दीयताम्</p>
          <p className="lg-verse-iast">aṅguṣṭho dakṣiṇo dīyatām</p>
          <p className="lg-verse-en">
            “Let your right thumb be given.” Eklavya gave it gladly, and his loyalty has been remembered for
            thousands of years longer than the skill he lost.
          </p>
        </div>
      </section>

      <section className="lg-lessons">
        <div className="lg-wrap">
          <div className="lg-lessons-head">
            <p className="lg-label">In the studio</p>
            <h2>What Eklavya teaches every artist</h2>
          </div>
          <div className="lg-lesson-grid">
            {LESSONS.map((l) => (
              <div className="lg-lesson" key={l.title}>
                {l.icon}
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lg-wrap lg-close">
        <p className="lg-label" style={{ color: 'var(--vermilion)' }}>Eklavya Art School</p>
        <blockquote>
          Here, the only <em>dakshina</em> we ask of our students is practice.
        </blockquote>
        <div className="lg-actions">
          <Link to="/contact" className="lg-btn lg-btn-solid">Join a class</Link>
          <Link to="/gallery" className="lg-btn lg-btn-ghost">See our students’ work</Link>
        </div>
        <p className="lg-source">
          Retold from the Mahabharata, Adi Parva. Details vary between regional tellings.
        </p>
      </section>
    </div>
  )
}
