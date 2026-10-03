import gsap from 'gsap'
import {
  Bot,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Link2,
  Mail,
  Palette,
  Sparkles,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import LightRibbons from '../components/layout/LightRibbons'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import { introSlides } from '../data/introCarouselSlides'

const iconMap = { Brain, Bot, Lightbulb, Palette, Link2, Mail, CheckCircle2, Sparkles }
const SLIDE_COUNT = introSlides.length

/**
 * Immersive 3-slide showcase carousel — a deliberate, scoped departure from
 * the site's usual minimalist system (see DESIGN.md, "Intro Showcase").
 * `centralIcon` / `floatingIcons` are lucide placeholders standing in for
 * real illustrations; swap <CentralIllustration>/the floating <span> for an
 * <img> once the asset files exist — no other structural change needed.
 */
const AUTOPLAY_INTERVAL = 3000

export default function IntroSection() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const wordRef = useRef(null)
  const centralRef = useRef(null)
  const floatingRefs = useRef([])
  const floatingTweens = useRef([])
  const liveRegionRef = useRef(null)

  const slide = introSlides[index]
  const CentralIcon = iconMap[slide.centralIcon]

  // Autoplay — pauses on hover/keyboard-focus and stops entirely under
  // reduced motion (an auto-advancing carousel is auto-updating content;
  // WCAG 2.2.2 wants a way to stop it, hover/focus-pause covers that here).
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || isPaused) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDE_COUNT)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [index, isPaused])

  // Continuous floating bob for the decorative icons — off under reduced motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    floatingTweens.current.forEach((tween) => tween?.kill())
    floatingTweens.current = []
    if (reduceMotion) return

    floatingRefs.current.forEach((el, i) => {
      if (!el) return
      floatingTweens.current.push(
        gsap.to(el, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.4 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }),
      )
    })

    return () => floatingTweens.current.forEach((tween) => tween?.kill())
  }, [index])

  // Slide-change entrance: word slides in, illustration scales in, icons pop in staggered.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduceMotion ? 0 : 0.8

    if (wordRef.current) {
      gsap.fromTo(
        wordRef.current,
        { opacity: 0, x: reduceMotion ? 0 : 60 },
        { opacity: 1, x: 0, duration: dur, ease: 'power3.out' },
      )
    }
    if (centralRef.current) {
      gsap.fromTo(
        centralRef.current,
        { opacity: 0, scale: reduceMotion ? 1 : 0.85 },
        { opacity: 1, scale: 1, duration: dur, ease: 'power3.out', delay: reduceMotion ? 0 : 0.1 },
      )
    }
    floatingRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, scale: reduceMotion ? 1 : 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: reduceMotion ? 0 : 0.6,
          delay: reduceMotion ? 0 : 0.25 + i * 0.08,
          ease: reduceMotion ? 'none' : 'back.out(1.7)',
        },
      )
    })

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Slide ${index + 1} de ${SLIDE_COUNT}: ${slide.title}`
    }
  }, [index, slide.title])

  const goTo = (next) => setIndex(((next % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT)

  return (
    <section
      id="intro"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Como funciona"
      className="relative flex min-h-screen scroll-mt-24 flex-col overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
      }}
    >
      <span ref={liveRegionRef} role="status" className="sr-only" />

      {/* Background wash — consistent across slides, only the foreground changes.
          Its last 14rem dissolve into the page's own background, so there's no
          hard edge where the Intro ends and the Formulário begins. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-base-950"
        style={{ maskImage: 'linear-gradient(to bottom, #000 calc(100% - 14rem), transparent)' }}
      >
        <div className="absolute top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent-500/20 blur-[130px]" />
        <div className="absolute -right-10 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent-600/15 blur-[120px]" />
        <div className="absolute bottom-10 left-0 h-64 w-64 rounded-full bg-glow-400/10 blur-[100px]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[6%] left-[4%] hidden h-32 w-32 rounded-full bg-gradient-to-br from-accent-400/40 to-accent-700/40 blur-sm sm:block"
      />
      <LightRibbons />

      <Container className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="relative flex w-full items-center justify-center">
          {slide.floatingIcons.map((item, i) => {
            const Icon = iconMap[item.icon]
            return (
              <span
                key={`${slide.id}-${i}`}
                ref={(el) => (floatingRefs.current[i] = el)}
                aria-hidden="true"
                className={`absolute hidden h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-accent-300 shadow-lg shadow-black/30 backdrop-blur-sm sm:flex ${item.position}`}
              >
                <Icon className="h-6 w-6" />
              </span>
            )
          })}

          <div
            ref={centralRef}
            aria-hidden="true"
            className="relative flex h-56 w-56 flex-col items-center justify-center gap-7 rounded-full border border-white/10 bg-white/[0.04] shadow-2xl shadow-accent-600/20 backdrop-blur-sm sm:h-72 sm:w-72"
          >
            {CentralIcon && (
              <CentralIcon className="h-20 w-20 text-accent-300 sm:h-24 sm:w-24" strokeWidth={1.5} />
            )}
            <span className="px-4 text-center text-[10px] tracking-wider text-white/40 uppercase">
              {slide.centralLabel}
            </span>
          </div>
        </div>

        <span
          ref={wordRef}
          aria-hidden="true"
          className="pointer-events-none block font-display text-[10vw] leading-none font-extrabold text-white/15 select-none sm:text-[7vw] md:text-[6vw]"
        >
          {slide.bgWord}
        </span>

        <div data-light-avoid="text" className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="max-w-lg font-display text-2xl font-semibold text-white sm:text-3xl">
            {slide.title}
          </h1>
          <Button as="a" href={slide.cta.href}>
            {slide.cta.label}
          </Button>
        </div>
      </Container>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Slide anterior"
        className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white sm:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Próximo slide"
        className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white sm:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        role="group"
        aria-label="Slides"
        className="relative z-20 flex items-center justify-center gap-2 pb-8"
      >
        {introSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para o slide ${i + 1}: ${s.title}`}
            aria-current={i === index ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/25 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
