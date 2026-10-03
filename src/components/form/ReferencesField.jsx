import { Plus, X } from 'lucide-react'
import { useId } from 'react'
import FieldShell from './FieldShell'

export default function ReferencesField({ references, onChange }) {
  const id = useId()

  const updateReference = (index, newValue) => {
    const next = [...references]
    next[index] = newValue
    onChange(next)
  }

  const addReference = () => onChange([...references, ''])

  const removeReference = (index) =>
    onChange(references.filter((_, i) => i !== index))

  return (
    <FieldShell
      id={id}
      label="Referências"
      hint="Links de sites, perfis ou marcas que você curte (não precisa ser da mesma área)."
    >
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        className="flex flex-col gap-2"
      >
        {references.map((reference, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={reference}
              onChange={(event) => updateReference(index, event.target.value)}
              placeholder="https://..."
              aria-label={`Referência ${index + 1}`}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-accent-500 focus:bg-white/[0.07]"
            />
            {references.length > 1 && (
              <button
                type="button"
                onClick={() => removeReference(index)}
                aria-label="Remover referência"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addReference}
        className="flex w-fit items-center gap-1.5 rounded-full border border-dashed border-white/20 px-4 py-2.5 text-xs font-medium text-white/60 transition-colors hover:border-accent-500/50 hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" />
        Adicionar referência
      </button>
    </FieldShell>
  )
}
