import { useId } from 'react'
import FieldShell from './FieldShell'

export const MIN_BUDGET = 80

// Whole reais only: the visitor is giving a ballpark, not a quote, so cents
// would just be noise. `value` holds raw digits ("1500"); the input shows
// them grouped the Brazilian way ("1.500").
const MAX_DIGITS = 7

export default function BudgetField({ value, onChange, onBlur, error }) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined
  const display = value ? Number(value).toLocaleString('pt-BR') : ''

  return (
    <FieldShell
      id={id}
      label="Quanto você pensa em investir?"
      hint={`A partir de R$ ${MIN_BUDGET}. Pode ser uma estimativa — a gente ajusta junto depois.`}
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-white/50"
        >
          R$
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={display}
          onChange={(event) =>
            onChange(event.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_DIGITS))
          }
          onBlur={onBlur}
          placeholder={`Ex: ${MIN_BUDGET * 2}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[`${id}-hint`, errorId].filter(Boolean).join(' ')}
          className={`w-full rounded-xl border bg-white/5 py-2.5 pr-4 pl-11 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:bg-white/[0.07] ${
            error
              ? 'border-accent-400/70 focus:border-accent-400'
              : 'border-white/10 focus:border-accent-500'
          }`}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-accent-300">
          {error}
        </p>
      )}
    </FieldShell>
  )
}
