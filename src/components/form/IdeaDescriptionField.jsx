import { useId } from 'react'
import FieldShell from './FieldShell'

export default function IdeaDescriptionField({ value, onChange, error }) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <FieldShell
      id={id}
      label="Descreva a ideia do seu site"
      hint="Fique à vontade: pra que serve, quem vai visitar, o que não pode faltar..."
    >
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        placeholder="Ex: quero um site para minha marca de roupas, com uma vibe minimalista, onde as pessoas possam ver a coleção e falar comigo pelo WhatsApp..."
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[`${id}-hint`, errorId].filter(Boolean).join(' ')}
        className={`w-full resize-none rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:bg-white/[0.07] ${
          error
            ? 'border-accent-400/70 focus:border-accent-400'
            : 'border-white/10 focus:border-accent-500'
        }`}
      />
      {error && (
        <p id={errorId} className="text-sm text-accent-300">
          {error}
        </p>
      )}
    </FieldShell>
  )
}
