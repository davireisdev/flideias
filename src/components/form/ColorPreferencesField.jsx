import { useId } from 'react'
import FieldShell from './FieldShell'

// Curated as "vibes" rather than a full rainbow — six clusters that cover
// most preferences, so someone who doesn't know how to describe colors
// still has a fast starting point. The free-text field below is the
// primary path for anything more specific.
const palette = [
  { id: 'dark', hex: '#18181b', label: 'Escuro e sofisticado' },
  { id: 'neutral', hex: '#d4cfc4', label: 'Claro e neutro' },
  { id: 'blue', hex: '#3b82f6', label: 'Azul, confiança' },
  { id: 'green', hex: '#22c55e', label: 'Verde, natural' },
  { id: 'warm', hex: '#f97316', label: 'Quente, energético' },
  { id: 'pink', hex: '#ec4899', label: 'Rosa, delicado' },
]

export default function ColorPreferencesField({
  selectedColors,
  onToggleColor,
  colorNotes,
  onChangeNotes,
}) {
  const id = useId()

  return (
    <FieldShell
      id={id}
      label="Cores que você imagina"
      hint="Escolha uma ou mais vibes abaixo, ou pule direto pro campo de texto e descreva do seu jeito."
    >
      <div role="group" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-3">
        {palette.map((color) => {
          const isSelected = selectedColors.includes(color.id)
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onToggleColor(color.id)}
              title={color.label}
              aria-pressed={isSelected}
              className={`h-11 w-11 rounded-full transition-all duration-150 ${
                isSelected
                  ? 'ring-2 ring-accent-400 ring-offset-2 ring-offset-base-950 scale-110'
                  : 'ring-1 ring-white/15 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
            >
              <span className="sr-only">{color.label}</span>
            </button>
          )
        })}
      </div>

      <textarea
        id={id}
        value={colorNotes}
        onChange={(event) => onChangeNotes(event.target.value)}
        rows={2}
        placeholder="Ex: algo pastel e claro, ou bem escuro e sofisticado..."
        aria-describedby={`${id}-hint`}
        className="mt-1 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-accent-500 focus:bg-white/[0.07]"
      />
    </FieldShell>
  )
}
