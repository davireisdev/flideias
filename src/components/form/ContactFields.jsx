import { useId } from 'react'
import { formatWhatsapp, normalizeWhatsapp } from './contactValidation'

const ERRORS = {
  name: 'Como a gente pode te chamar? 🙂',
  whatsapp: 'Confere o número com DDD, tipo (11) 91234-5678 🙂',
  email: 'Esse e-mail parece incompleto — dá uma conferida?',
}

function ContactInput({ label, error, ...props }) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white/70">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:bg-white/[0.07] ${
          error
            ? 'border-accent-400/70 focus:border-accent-400'
            : 'border-white/10 focus:border-accent-500'
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-accent-300">
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactFields({ value, errors, onChange, onBlur }) {
  const hintId = useId()
  return (
    <fieldset aria-describedby={hintId} className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
      <legend className="p-0 text-sm font-medium text-white">Como a gente te responde?</legend>
      <p id={hintId} className="text-xs text-white/50">
        Seu nome e WhatsApp pra gente conversar sobre a ideia. E-mail é opcional.
      </p>

      <div className="mt-1 flex flex-col gap-3">
        <ContactInput
          label="Nome"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Como você gosta de ser chamado"
          value={value.name}
          onChange={(event) => onChange('name', event.target.value)}
          onBlur={() => onBlur('name')}
          error={errors.name ? ERRORS.name : null}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ContactInput
            label="WhatsApp"
            type="tel"
            name="whatsapp"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(11) 91234-5678"
            value={formatWhatsapp(value.whatsapp)}
            onChange={(event) => onChange('whatsapp', normalizeWhatsapp(event.target.value))}
            onBlur={() => onBlur('whatsapp')}
            error={errors.whatsapp ? ERRORS.whatsapp : null}
          />
          <ContactInput
            label="E-mail (opcional)"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={value.email}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={() => onBlur('email')}
            error={errors.email ? ERRORS.email : null}
          />
        </div>
      </div>
    </fieldset>
  )
}
