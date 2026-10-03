import { useEffect, useRef } from 'react'

/**
 * A soft violet glow that trails the cursor with a gentle lag — reads as
 * water/liquid rather than snapping to the pointer. Desktop with a real
 * mouse only (skipped on touch, where there's no persistent cursor) and
 * off entirely under prefers-reduced-motion: continuous cursor-follow
 * motion has no functional purpose, so there's nothing to preserve.
 */
export default function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = glowRef.current
    if (!canHover || reduceMotion || !el) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let visible = false
    let raf

    const handleMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!visible) {
        visible = true
        el.style.opacity = '1'
      }
    }

    const handleLeave = () => {
      visible = false
      el.style.opacity = '0'
    }

    const tick = () => {
      // Lerp toward the cursor instead of snapping — the "like water" drag.
      currentX += (targetX - currentX) * 0.07
      currentY += (targetY - currentY) * 0.07
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -z-10 h-[26rem] w-[26rem] rounded-full bg-accent-500/15 opacity-0 blur-[100px] transition-opacity duration-500"
    />
  )
}
