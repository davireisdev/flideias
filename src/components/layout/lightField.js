// Engine behind <LightRibbons>: ONE silky light ribbon running down the whole
// page — Intro → Formulário → Encerramento. Each section mounts its own canvas,
// so the light scrolls natively with the content (no scroll syncing, no lag),
// and this module draws every visible canvas from the same path, in the same
// frame, so the ribbon continues seamlessly across section boundaries.
//
// Readability: any element marked `data-light-avoid` erases the light around it
//   "text" → union of its children's boxes, soft falloff (headings, CTAs, copy)
//   "card" → its own box, tight edge, so panels read as sitting in front of it
// so nothing ever glows behind text.
//
// Palette = site tokens only: violet family outside, lavender + cyan in the
// core (cyan stays background-only, per The One Star Rule). The light drifts,
// it never blinks (DESIGN.md).

const OUTER = ['139,92,246', '124,58,237', '167,139,250'] // accent-500/600/400
const CORE = ['196,181,253', '103,232,249'] // accent-300, glow-300
const STILL_TIME = 14 // seconds — the frame shown when not animating
// The light drifts slowly, so 30fps reads as smooth and halves the work;
// a soft glow doesn't need retina sharpness either, hence the DPR cap.
const FRAME_MS = 1000 / 30
const MAX_DPR = 1.5
// Self-protection for weak devices (e.g. canvas without GPU raster): if a
// frame keeps costing more than this on the main thread, step down a quality
// level — fewer strands at 1x — and if that still doesn't fit, freeze on a
// still frame. Decoration must never make the page janky.
const BUDGET_MS = 6
const QUALITY = [
  { strands: 64, dpr: MAX_DPR },
  { strands: 36, dpr: 1 },
]
// Each canvas extends this far past its section (clipped by the section), so
// the blurred halo near a boundary includes the neighbour's strands: no seam.
export const BLEED = 64
const STEP = 9 // px between path samples
const DRIFT = 0.04 // how far waypoints wander (fraction of width / height)

const SECTIONS = ['intro', 'formulario', 'encerramento']

// Waypoints: [section id, x as a fraction of the page width, y as a fraction
// of that section's height]. The Intro part traces the approved first version
// (top-right corner, down the right of the copy); from there the ribbon keeps
// going instead of ending.
const INTRO = [
  ['intro', 1.12, -0.14],
  ['intro', 0.834, 0.114],
  ['intro', 0.756, 0.342],
  ['intro', 0.728, 0.584],
  ['intro', 0.71, 0.84],
]
const PATHS = {
  // ≥1024px (two-column form): down the right edge and the assistant column,
  // across under the form to the left, around the closing column, out
  // bottom-right.
  wide: [
    ...INTRO,
    ['formulario', 0.93, 0.1],
    ['formulario', 0.72, 0.42],
    ['formulario', 0.96, 0.7],
    ['formulario', 0.64, 0.97],
    ['encerramento', 0.12, 0.3],
    ['encerramento', 0.28, 0.82],
    ['encerramento', 1.15, 1.2],
  ],
  // <1024px: the form spans the full width, so the light runs down the right
  // gutter and shows itself in the gaps between blocks.
  narrow: [
    ...INTRO,
    ['formulario', 0.97, 0.06],
    ['formulario', 0.965, 0.5],
    ['formulario', 0.94, 0.97],
    ['encerramento', 0.05, 0.3],
    ['encerramento', 0.18, 0.85],
    ['encerramento', 1.25, 1.15],
  ],
}

// Tiny seeded PRNG so the strand layout is identical on every load.
function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildStrands(count, rand) {
  return Array.from({ length: count }, (_, i) => {
    const u = (i / (count - 1)) * 2 - 1
    const d = Math.sign(u) * Math.abs(u) ** 1.35 // denser toward the core
    const core = Math.abs(d) < 0.22
    const palette = core && rand() < 0.75 ? CORE : OUTER
    return {
      d,
      rgb: palette[Math.floor(rand() * palette.length)],
      alpha: core ? 0.32 + rand() * 0.28 : 0.14 + rand() * 0.2,
      width: core ? 0.9 + rand() * 0.7 : 0.6 + rand() * 0.8,
      phase: rand() * Math.PI * 2,
      speed: 0.25 + rand() * 0.35,
      amp: 0.3 + rand() * 0.7,
    }
  })
}

function buildParticles(count, rand) {
  return Array.from({ length: count }, () => ({
    f: rand(), // position along the whole path (fraction)
    v: 8 + rand() * 17, // px per second
    d: (rand() * 2 - 1) * 1.6,
    size: 0.6 + rand() * 1.2,
    alpha: 0.2 + rand() * 0.4,
    phase: rand() * Math.PI * 2,
  }))
}

// ---------------------------------------------------------------- the path
// Sampled every frame into flat arrays (page coordinates): position, arc
// length, unit normal and the ribbon's half-width there.
let cap = 0
let px, py, ps, pnx, pny, phw
let count = 0
let total = 0
let ribbon = 0

function ensureCapacity(n) {
  if (n <= cap) return
  cap = Math.ceil(n * 1.5)
  px = new Float32Array(cap)
  py = new Float32Array(cap)
  ps = new Float32Array(cap)
  pnx = new Float32Array(cap)
  pny = new Float32Array(cap)
  phw = new Float32Array(cap)
}

// Centripetal Catmull-Rom knot spacing (|d|^0.5): no cusps or loops even
// though the waypoints are unevenly spaced.
const knot = (a, b) => Math.max(1e-3, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])))

function buildPath(geo, time) {
  const wps = geo.narrow ? PATHS.narrow : PATHS.wide
  const pts = wps.map(([id, fx, fy], i) => {
    const sec = geo.sections[id]
    let x = fx * geo.W
    let y = sec.top + fy * sec.h
    if (i > 0 && i < wps.length - 1) {
      x += DRIFT * geo.W * Math.sin(time * (0.09 + 0.013 * i) + i * 1.7)
      y += DRIFT * geo.VH * Math.sin(time * (0.11 + 0.011 * i) + i * 2.3)
    }
    return [x, y]
  })
  const n = pts.length
  const ext = [
    [2 * pts[0][0] - pts[1][0], 2 * pts[0][1] - pts[1][1]],
    ...pts,
    [2 * pts[n - 1][0] - pts[n - 2][0], 2 * pts[n - 1][1] - pts[n - 2][1]],
  ]

  let estimate = 2
  for (let i = 0; i < n - 1; i++) {
    estimate += Math.ceil(Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) / STEP) + 4
  }
  ensureCapacity(estimate)

  count = 0
  for (let i = 0; i < n - 1; i++) {
    const p0 = ext[i]
    const p1 = ext[i + 1]
    const p2 = ext[i + 2]
    const p3 = ext[i + 3]
    const t1 = knot(p0, p1)
    const t2 = t1 + knot(p1, p2)
    const t3 = t2 + knot(p2, p3)
    const segs = Math.max(4, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / STEP))
    for (let k = 0; k < segs; k++) {
      const t = t1 + ((t2 - t1) * k) / segs
      // Barry–Goldman pyramid (t0 = 0)
      const a1 = (t1 - t) / t1
      const b1 = t / t1
      const a2 = (t2 - t) / (t2 - t1)
      const b2 = (t - t1) / (t2 - t1)
      const a3 = (t3 - t) / (t3 - t2)
      const b3 = (t - t2) / (t3 - t2)
      const A1x = a1 * p0[0] + b1 * p1[0]
      const A1y = a1 * p0[1] + b1 * p1[1]
      const A2x = a2 * p1[0] + b2 * p2[0]
      const A2y = a2 * p1[1] + b2 * p2[1]
      const A3x = a3 * p2[0] + b3 * p3[0]
      const A3y = a3 * p2[1] + b3 * p3[1]
      const B1x = ((t2 - t) * A1x + t * A2x) / t2
      const B1y = ((t2 - t) * A1y + t * A2y) / t2
      const B2x = ((t3 - t) * A2x + (t - t1) * A3x) / (t3 - t1)
      const B2y = ((t3 - t) * A2y + (t - t1) * A3y) / (t3 - t1)
      px[count] = a2 * B1x + b2 * B2x
      py[count] = a2 * B1y + b2 * B2y
      count++
    }
  }
  px[count] = pts[n - 1][0]
  py[count] = pts[n - 1][1]
  count++

  ps[0] = 0
  for (let i = 1; i < count; i++) ps[i] = ps[i - 1] + Math.hypot(px[i] - px[i - 1], py[i] - py[i - 1])
  total = ps[count - 1]

  ribbon = Math.min(geo.W, geo.VH) * 0.17
  for (let i = 0; i < count; i++) {
    const j0 = i > 0 ? i - 1 : i
    const j1 = i < count - 1 ? i + 1 : i
    const tx = px[j1] - px[j0]
    const ty = py[j1] - py[j0]
    const len = Math.hypot(tx, ty) || 1
    pnx[i] = -ty / len
    pny[i] = tx / len
    // The twist makes strands converge and swap sides, like a ribbon turning
    // in 3D; the slow envelope lets it breathe in width along the page.
    const twist = 0.3 + 0.7 * Math.cos((ps[i] / ribbon) * 0.6 + time * 0.22)
    const envelope = 0.72 + 0.28 * Math.sin((ps[i] / ribbon) * 0.23 + 1.3)
    phw[i] = ribbon * twist * envelope
  }
}

function indexAt(s) {
  let lo = 0
  let hi = count - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (ps[mid] < s) lo = mid + 1
    else hi = mid
  }
  return lo
}

// ---------------------------------------------------------------- layout
function measure() {
  const sy = window.scrollY
  const W = document.documentElement.clientWidth
  const VH = window.innerHeight
  const sections = {}
  for (const id of SECTIONS) {
    const el = document.getElementById(id)
    if (!el) return null
    const r = el.getBoundingClientRect()
    sections[id] = { top: r.top + sy, h: r.height }
  }

  const zones = []
  for (const el of document.querySelectorAll('[data-light-avoid]')) {
    const card = el.dataset.lightAvoid === 'card'
    let l = Infinity
    let t = Infinity
    let r = -Infinity
    let b = -Infinity
    for (const box of card ? [el] : el.children) {
      const q = box.getBoundingClientRect()
      if (!q.width || !q.height) continue
      l = Math.min(l, q.left)
      t = Math.min(t, q.top)
      r = Math.max(r, q.right)
      b = Math.max(b, q.bottom)
    }
    if (!(r > l && b > t)) continue
    // Text zones get square box corners (the mask's rounding then comes only
    // from the falloff, so even a glyph in the box's corner sits ≥2σ inside
    // the fully-erased core); cards keep their own rounded-3xl corner.
    zones.push({ x: l, y: t + sy, w: r - l, h: b - t, soft: card ? 14 : 40, radius: card ? 24 : 0 })
  }

  for (const inst of instances) {
    const q = inst.root.getBoundingClientRect()
    inst.left = q.left
    inst.top = q.top + sy
    inst.w = q.width
    inst.h = q.height
  }
  return { sy, W, VH, sections, zones, narrow: W < 1024, dim: W < 640 ? 0.75 : 1 }
}

// Soft erase mask for a zone: a rounded rect whose blurred shadow fades out
// past the box. Cached per size, drawn at half resolution (it's all falloff).
const masks = new Map()
function softMask(w, h, soft, radius) {
  const W = Math.round(w)
  const H = Math.round(h)
  const key = `${W}x${H}:${soft}`
  let mask = masks.get(key)
  if (mask) return mask
  if (masks.size > 32) masks.clear()
  const S = 0.5
  const pad = Math.ceil(soft * 2.6)
  const grow = soft // σ = soft/2, so the box itself sits ≥2σ inside: fully erased
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil((W + 2 * pad) * S)
  canvas.height = Math.ceil((H + 2 * pad) * S)
  const c = canvas.getContext('2d')
  const shift = canvas.width + 16 // the shape sits off-canvas; only its shadow lands
  c.shadowColor = '#000'
  c.shadowBlur = soft * S
  c.shadowOffsetX = shift
  c.fillStyle = '#000'
  c.beginPath()
  c.roundRect((pad - grow) * S - shift, (pad - grow) * S, (W + 2 * grow) * S, (H + 2 * grow) * S, (radius + grow) * S)
  c.fill()
  mask = { canvas, pad }
  masks.set(key, mask)
  return mask
}

// ---------------------------------------------------------------- drawing
const instances = new Set()
let strandKey = ''
let strands = []
let particles = []

function ensureStrands(geo, quality) {
  const key = `${geo.narrow ? 'n' : 'w'}${geo.W < 640 ? 's' : ''}:${quality.strands}`
  if (key === strandKey) return
  strandKey = key
  const rand = seeded(7)
  strands = buildStrands(Math.min(geo.W < 640 ? 40 : 64, quality.strands), rand)
  particles = buildParticles(geo.narrow ? 110 : 190, rand)
}

function drawInstance(inst, geo, time, still, quality) {
  const cssW = inst.w
  const cssH = inst.h + 2 * BLEED
  const dpr = Math.min(window.devicePixelRatio || 1, quality.dpr)
  if (cssW !== inst.cssW || cssH !== inst.cssH || dpr !== inst.dpr) {
    inst.canvas.width = Math.max(1, Math.round(cssW * dpr))
    inst.canvas.height = Math.max(1, Math.round(cssH * dpr))
    inst.glow.width = Math.max(1, Math.round(cssW / 4))
    inst.glow.height = Math.max(1, Math.round(cssH / 4))
    inst.cssW = cssW
    inst.cssH = cssH
    inst.dpr = dpr
  }
  const { ctx, gctx } = inst
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const left = inst.left
  const top = inst.top - BLEED
  // While animating, only work on what's near the viewport (one screen of
  // margin each way); a still frame covers the whole canvas once.
  let winTop = top
  let winBottom = top + cssH
  if (!still) {
    winTop = Math.max(winTop, geo.sy - geo.VH)
    winBottom = Math.min(winBottom, geo.sy + 2 * geo.VH)
  }

  if (winBottom > winTop) {
    const margin = ribbon * 1.6 + 8
    let i0 = -1
    let i1 = -1
    for (let i = 0; i < count; i++) {
      if (py[i] >= winTop - margin && py[i] <= winBottom + margin) {
        if (i0 < 0) i0 = i
        i1 = i
      }
    }

    if (i0 >= 0) {
      i0 = Math.max(0, i0 - 1)
      i1 = Math.min(count - 1, i1 + 1)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const st of strands) {
        ctx.beginPath()
        for (let i = i0; i <= i1; i++) {
          const wave = st.amp * ribbon * 0.12 * Math.sin((ps[i] / ribbon) * 0.76 + time * st.speed + st.phase)
          const off = st.d * phw[i] + wave
          const x = px[i] + pnx[i] * off - left
          const y = py[i] + pny[i] * off - top
          if (i === i0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${st.rgb},${st.alpha * geo.dim})`
        ctx.lineWidth = st.width
        ctx.stroke()
      }

      ctx.fillStyle = 'rgb(196,181,253)'
      for (const p of particles) {
        const i = indexAt((p.f * total + time * p.v) % total)
        if (py[i] < winTop - 4 || py[i] > winBottom + 4) continue
        const off = p.d * phw[i]
        ctx.globalAlpha = p.alpha * geo.dim * (0.6 + 0.4 * Math.sin(time * 0.8 + p.phase))
        const x = px[i] + pnx[i] * off - left
        const y = py[i] + pny[i] * off - top
        ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
    }

    ctx.globalCompositeOperation = 'destination-out'
    for (const z of geo.zones) {
      const mask = softMask(z.w, z.h, z.soft, z.radius)
      if (z.y + z.h + mask.pad < winTop || z.y - mask.pad > winBottom) continue
      ctx.drawImage(mask.canvas, z.x - mask.pad - left, z.y - mask.pad - top, z.w + 2 * mask.pad, z.h + 2 * mask.pad)
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  gctx.clearRect(0, 0, inst.glow.width, inst.glow.height)
  gctx.drawImage(inst.canvas, 0, 0, inst.glow.width, inst.glow.height)
}

// ---------------------------------------------------------------- scheduling
// One shared loop for every section's canvas: same time, same frame.
let raf = 0
let lastDraw = -Infinity
let level = 0 // index into QUALITY; QUALITY.length = frozen
let cost = 0 // moving average of a frame's draw time (ms)
let measured = 0
let reduceMotion = false
let intersection = null
let resizes = null
let stillQueued = false

const isStill = () => reduceMotion || level >= QUALITY.length

function render(time, still) {
  const geo = measure()
  if (!geo) return
  const quality = QUALITY[Math.min(level, QUALITY.length - 1)]
  ensureStrands(geo, quality)
  buildPath(geo, time)
  for (const inst of instances) {
    if (still || inst.visible) drawInstance(inst, geo, time, still, quality)
  }
}

function loop(now) {
  raf = requestAnimationFrame(loop)
  if (now - lastDraw < FRAME_MS - 1) return
  lastDraw = now
  const t0 = performance.now()
  render(now / 1000, false)
  const dt = performance.now() - t0
  cost = measured ? cost * 0.85 + dt * 0.15 : dt
  measured += 1
  if (measured > 24 && cost > BUDGET_MS) {
    level += 1
    cost = 0
    measured = 0
    if (isStill()) {
      stop()
      queueStill()
    }
  }
}

const anyVisible = () => [...instances].some((inst) => inst.visible)

function start() {
  if (!raf && !isStill() && anyVisible()) raf = requestAnimationFrame(loop)
}

function stop() {
  cancelAnimationFrame(raf)
  raf = 0
}

// Still frames don't need a loop: redraw only when the layout changes.
function queueStill() {
  if (stillQueued) return
  stillQueued = true
  requestAnimationFrame(() => {
    stillQueued = false
    render(STILL_TIME, true)
  })
}

export function registerLight(inst) {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  Object.assign(inst, {
    ctx: inst.canvas.getContext('2d'),
    gctx: inst.glow.getContext('2d'),
    visible: false,
    cssW: 0,
    cssH: 0,
    dpr: 0,
  })
  instances.add(inst)

  if (!intersection) {
    intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const item of instances) if (item.root === entry.target) item.visible = entry.isIntersecting
        }
        if (anyVisible()) start()
        else stop()
      },
      { rootMargin: '200px 0px' },
    )
  }
  if (!resizes) {
    // A text block that just changed size (new carousel slide, submitted
    // form…) gets its clear zone redrawn in the same frame, before paint —
    // otherwise the light could show behind the new copy for one frame.
    resizes = new ResizeObserver(() => {
      if (isStill()) queueStill()
      else if (raf) render(performance.now() / 1000, false)
    })
  }
  intersection.observe(inst.root)
  resizes.observe(inst.root)
  for (const el of document.querySelectorAll('[data-light-avoid]')) resizes.observe(el)
  if (isStill()) queueStill()

  return () => {
    instances.delete(inst)
    intersection?.unobserve(inst.root)
    resizes?.unobserve(inst.root)
    if (!anyVisible()) stop()
    if (!instances.size) {
      intersection?.disconnect()
      resizes?.disconnect()
      intersection = null
      resizes = null
    }
  }
}
