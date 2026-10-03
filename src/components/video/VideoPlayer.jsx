import { Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Simple play-button video player.
 * Drop your file at `public/videos/apresentacao.mp4` (or pass a different
 * `src`) once it's ready — no other wiring needed.
 */
export default function VideoPlayer({
  src = '/videos/apresentacao.mp4',
  poster,
  title = 'Vídeo de apresentação',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [videoMissing, setVideoMissing] = useState(false)
  const triggerRef = useRef(null)
  const dialogContentRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const trigger = triggerRef.current
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      // Trap focus inside the dialog while it's open.
      const focusable = dialogContentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, video, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      trigger?.focus()
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-base-850 shadow-2xl shadow-black/40"
        style={
          poster
            ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
        aria-label={`Assistir: ${title}`}
      >
        {!poster && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 via-base-850 to-glow-400/10" />
        )}
        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-base-950 shadow-lg transition-transform duration-200 group-hover:scale-110 sm:h-20 sm:w-20">
          <Play className="ml-1 h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
        </span>
        <span className="absolute bottom-4 left-4 text-sm font-medium text-white/80">
          {title}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={dialogContentRef}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-base-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="Fechar vídeo"
            >
              <X className="h-5 w-5" />
            </button>

            {videoMissing ? (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center text-white/60">
                <p className="font-medium text-white">Vídeo em breve</p>
                <p className="text-sm">
                  Assim que o arquivo for adicionado em{' '}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                    {src}
                  </code>{' '}
                  ele aparecerá aqui automaticamente.
                </p>
              </div>
            ) : (
              <video
                className="aspect-video w-full"
                src={src}
                controls
                autoPlay
                onError={() => setVideoMissing(true)}
              >
                Seu navegador não suporta vídeo em HTML5.
              </video>
            )}
          </div>
        </div>
      )}
    </>
  )
}
