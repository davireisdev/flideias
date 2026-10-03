import { Sparkles } from 'lucide-react'

/**
 * Placeholder for the future AI assistant that will help the visitor
 * flesh out their idea while they fill the form. No AI logic is wired
 * up yet — this only reserves the layout and visual space for it.
 */
export default function AIAssistantPanel() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/15 text-accent-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <h3 className="font-display text-sm font-semibold text-white">
            Assistente de criação
          </h3>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white/50">
          Em breve
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-end gap-3">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3 text-sm text-white/70">
          Em breve, vou te ajudar a lapidar sua ideia por aqui enquanto você escreve 👋
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 opacity-60">
        <input
          type="text"
          disabled
          aria-label="Assistente de criação (em breve)"
          placeholder="O assistente estará disponível em breve..."
          className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
        />
      </div>
    </div>
  )
}
