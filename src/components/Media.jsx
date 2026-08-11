import { forwardRef, useEffect, useRef, useState } from 'react'
import { videoPoster, videoSrc } from '../data/work'

export const LOGO_WORDMARK = '/assets/telabs-wordmark.webp'

// Intrinsic size of the trimmed wordmark. Width is derived from height so the
// browser reserves the correct box up front and the nav never reflows on load.
const LOGO_W = 1061
const LOGO_H = 190

// The image now carries the brand name on its own, so it needs a real alt.
export function Logo({ height = 26, style }) {
  return (
    <img
      src={LOGO_WORDMARK}
      alt="TE LABS"
      width={Math.round((height * LOGO_W) / LOGO_H)}
      height={height}
      style={{
        height,
        width: 'auto',
        flex: '0 0 auto',
        display: 'block',
        ...style,
      }}
    />
  )
}

/**
 * A muted looping film that only streams while it is on screen.
 *
 * preload="none" plus the poster means an off-screen tile costs one small JPEG
 * and nothing else. Without the observer the work grid opens 23 downloads at
 * once and mobile Safari, which allows only a handful of inline decoders,
 * stalls most of them on a black frame.
 */
export function AutoVideo({ src, title, width, style }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={videoSrc(src, width)}
      poster={videoPoster(src, width)}
      aria-label={title}
      playsInline
      preload="none"
      loop
      muted
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        background: '#050308',
        ...style,
      }}
    />
  )
}

export const Tower3D = forwardRef(function Tower3D({ subjectX, style }, ref) {
  const [x, setX] = useState(() => {
    if (subjectX != null) return subjectX
    if (typeof window !== 'undefined' && window.innerWidth < 960) return '0.5'
    return '0.74'
  })

  useEffect(() => {
    if (subjectX != null) {
      setX(subjectX)
      return undefined
    }
    const sync = () => setX(window.innerWidth < 960 ? '0.5' : '0.74')
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [subjectX])

  return <tower-3d ref={ref} className="te-tower" subject-x={x} style={style} />
})

export function Mini3D({ kind = 'globe', style }) {
  return <mini-3d kind={kind} style={style} />
}

export function ImageSlot({ id, placeholder = 'Drop an image', style }) {
  return (
    <div
      id={id}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 80,
        display: 'grid',
        placeItems: 'center',
        background:
          'linear-gradient(135deg, #150C20 0%, #241933 50%, #1A1028 100%)',
        border: '1px solid transparent',
        color: '#6E5C86',
        font: "500 11px 'JetBrains Mono', monospace",
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {placeholder}
    </div>
  )
}

export function SectionLabel({ index, label }) {
  return (
    <span
      style={{
        font: "500 12px 'JetBrains Mono', monospace",
        letterSpacing: '.2em',
        color: '#E8BE7C',
      }}
    >
      {index} / {label}
    </span>
  )
}

export function useCountUp(ref, to, suffix = '', pad = false) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fmt = (n) => (pad && n < 10 ? `0${n}` : String(n)) + suffix
    el.textContent = pad ? `00${suffix}` : `0${suffix}`
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const dur = 900
          const t0 = performance.now()
          const step = (now) => {
            const k = Math.min(1, (now - t0) / dur)
            el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))))
            if (k < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          setTimeout(() => {
            if (el.textContent !== fmt(to)) el.textContent = fmt(to)
          }, dur + 400)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, to, suffix, pad])
}

export function CountStat({ to, suffix = '', pad = false, label }) {
  const ref = useRef(null)
  useCountUp(ref, to, suffix, pad)
  return (
    <div className="te-stat-cell">
      <div
        ref={ref}
        style={{
          font: "400 clamp(28px, 3.4vw, 40px) Anton, sans-serif",
          color: '#E8BE7C',
        }}
      >
        {pad ? '00' : '0'}
        {suffix}
      </div>
      <div
        style={{
          font: "500 11px 'JetBrains Mono', monospace",
          letterSpacing: '.16em',
          color: '#8B7BA3',
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  )
}
