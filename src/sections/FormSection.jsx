import { useEffect, useState } from 'react'
import AIAssistantPanel from '../components/form/AIAssistantPanel'
import BudgetField, { MIN_BUDGET } from '../components/form/BudgetField'
import ColorPreferencesField from '../components/form/ColorPreferencesField'
import IdeaDescriptionField from '../components/form/IdeaDescriptionField'
import ImageUploader from '../components/form/ImageUploader'
import ReferencesField from '../components/form/ReferencesField'
import SocialLinks from '../components/social/SocialLinks'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'

// NOTE: submission is intentionally not wired up to any backend/email yet.
// This keeps the form data in local state (plus a localStorage draft as a
// safety net against accidental refresh/reload) so the UI is fully usable.
const DRAFT_KEY = 'flideias-form-draft'

// Read once, synchronously, so restored state can seed useState's lazy
// initializer directly — no mount effect, no extra render.
// Images aren't included: File objects aren't serializable, so only the
// text/selection fields survive a reload.
function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function FormSection() {
  const [description, setDescription] = useState(() => readDraft().description ?? '')
  const [selectedColors, setSelectedColors] = useState(() => readDraft().selectedColors ?? [])
  const [colorNotes, setColorNotes] = useState(() => readDraft().colorNotes ?? '')
  const [references, setReferences] = useState(() => {
    const draft = readDraft().references
    return draft?.length ? draft : ['']
  })
  const [budget, setBudget] = useState(() => readDraft().budget ?? '')
  const [images, setImages] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [budgetError, setBudgetError] = useState(false)

  useEffect(() => {
    // Debounced: writing on every keystroke is unnecessary main-thread work.
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ description, selectedColors, colorNotes, references, budget }),
        )
      } catch {
        // localStorage can throw (private browsing, quota) — best-effort only.
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [description, selectedColors, colorNotes, references, budget])

  const toggleColor = (colorId) => {
    setSelectedColors((current) =>
      current.includes(colorId)
        ? current.filter((id) => id !== colorId)
        : [...current, colorId],
    )
  }

  const handleDescriptionChange = (value) => {
    setDescription(value)
    if (descriptionError && value.trim()) setDescriptionError(false)
  }

  const isBudgetValid = (value) => Number(value) >= MIN_BUDGET

  const handleBudgetChange = (value) => {
    setBudget(value)
    if (budgetError && isBudgetValid(value)) setBudgetError(false)
  }

  // Only flag on blur once something was typed — an empty field the visitor
  // hasn't reached yet isn't an error until they try to send.
  const handleBudgetBlur = () => {
    if (budget && !isBudgetValid(budget)) setBudgetError(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const descriptionMissing = !description.trim()
    const budgetInvalid = !isBudgetValid(budget)
    setDescriptionError(descriptionMissing)
    setBudgetError(budgetInvalid)
    if (descriptionMissing || budgetInvalid) return

    // TODO: integrate real submission (email/API) later.
    setSubmitted(true)
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // best-effort cleanup only
    }
  }

  return (
    <section id="formulario" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Sua ideia"
          title="Agora, conta pra gente"
          subtitle="Quanto mais detalhes, melhor a gente entende a sua visão. Não existe resposta errada."
        />

        <form
          onSubmit={handleSubmit}
          className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start"
        >
          <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-6 py-6 text-center">
                <span className="text-4xl">🌱</span>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-display text-xl font-semibold text-white">
                    Ideia recebida por aqui!
                  </h3>
                  <p className="max-w-sm text-sm text-white/60">
                    Guardei tudo que você escreveu. Se quiser ter certeza que já
                    chegou até mim rapidinho, me chama com um resumo:
                  </p>
                </div>
                <SocialLinks />
              </div>
            ) : (
              <>
                <IdeaDescriptionField
                  value={description}
                  onChange={handleDescriptionChange}
                  error={descriptionError ? 'Conta pelo menos uma linhinha sobre sua ideia antes de enviar 🙂' : null}
                />

                <ColorPreferencesField
                  selectedColors={selectedColors}
                  onToggleColor={toggleColor}
                  colorNotes={colorNotes}
                  onChangeNotes={setColorNotes}
                />

                <ReferencesField references={references} onChange={setReferences} />

                <ImageUploader images={images} onChange={setImages} />

                <BudgetField
                  value={budget}
                  onChange={handleBudgetChange}
                  onBlur={handleBudgetBlur}
                  error={budgetError ? `Coloca um valor a partir de R$ ${MIN_BUDGET} 🙂` : null}
                />

                <div className="pt-2">
                  <Button type="submit">Enviar minha ideia</Button>
                </div>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-28">
            <AIAssistantPanel />
          </div>
        </form>
      </Container>
    </section>
  )
}
