import { useEffect, useRef } from 'react'

export function useMotion(rootRef, page) {
  const revealIO = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    revealIO.current =
      revealIO.current ||
      new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const el = e.target
            el.style.opacity = '1'
            el.style.transform = 'none'
            revealIO.current.unobserve(el)
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      )

    let i = 0
    root.querySelectorAll('h1, h2, h3, p, [data-reveal]').forEach((el) => {
      if (el.dataset.motionDone || el.closest('[data-no-reveal]')) return
      el.dataset.motionDone = '1'
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.92) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(14px)'
      const delay = (i % 5) * 55
      el.style.transition = `opacity .62s cubic-bezier(.22,.7,.25,1) ${delay}ms, transform .62s cubic-bezier(.22,.7,.25,1) ${delay}ms`
      i += 1
      revealIO.current.observe(el)
    })

    root.querySelectorAll('[data-lift]').forEach((el) => {
      if (el.dataset.liftWired) return
      el.dataset.liftWired = '1'
      el.style.transition =
        'transform .38s cubic-bezier(.22,.7,.25,1), border-color .3s ease, background .3s ease'
      el.addEventListener('pointerenter', () => {
        el.style.transform = 'translateY(-6px)'
      })
      el.addEventListener('pointerleave', () => {
        el.style.transform = 'none'
      })
    })

    root.querySelectorAll('button').forEach((el) => {
      if (el.dataset.pressWired) return
      el.dataset.pressWired = '1'
      el.style.transition =
        'transform .16s cubic-bezier(.3,.7,.3,1), background .28s ease, color .28s ease, border-color .28s ease'
      el.addEventListener('pointerdown', () => {
        el.style.transform = 'scale(.965)'
      })
      const back = () => {
        el.style.transform = 'none'
      }
      el.addEventListener('pointerup', back)
      el.addEventListener('pointerleave', back)
    })
  }, [rootRef, page])

  useEffect(
    () => () => {
      if (revealIO.current) revealIO.current.disconnect()
    },
    [],
  )
}
