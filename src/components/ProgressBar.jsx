import { useEffect, useRef } from 'react'

export default function ProgressBar() {
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const bar = barRef.current
      if (!bar) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 30,
        background: 'rgba(139,47,248,.12)',
      }}
    >
      <div ref={barRef} style={{ height: '100%', width: '0%', background: '#8B2FF8' }} />
    </div>
  )
}
