import { useEffect, useRef } from 'react'
import { BLEED, registerLight } from './lightField'

/**
 * One section's window onto the page-long light ribbon (see lightField.js).
 * Drop it as an `absolute inset-0` layer behind a section's content (content
 * needs `relative z-10`); every instance draws its slice of the same ribbon,
 * so it flows continuously from the Intro down to the Encerramento.
 *  - main canvas: the crisp strands, blended additively so crossings glow;
 *  - glow canvas: the same frame at 1/4 resolution, CSS-blurred, for the haze.
 * Both extend BLEED px past the section (clipped here) so the halo has no seam
 * at section boundaries.
 */
export default function LightRibbons() {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(
    () => registerLight({ root: rootRef.current, canvas: canvasRef.current, glow: glowRef.current }),
    [],
  )

  const bleed = { top: -BLEED, height: `calc(100% + ${2 * BLEED}px)` }
  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={glowRef} className="absolute inset-x-0 w-full opacity-90 blur-xl" style={bleed} />
      <canvas ref={canvasRef} className="absolute inset-x-0 w-full" style={bleed} />
    </div>
  )
}
