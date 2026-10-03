import { ArrowUp } from 'lucide-react'
import LightRibbons from '../components/layout/LightRibbons'
import SocialLinks from '../components/social/SocialLinks'
import Container from '../components/ui/Container'

export default function ClosingSection() {
  return (
    <section id="encerramento" className="relative scroll-mt-24 py-24 sm:py-32">
      <LightRibbons />
      <Container data-light-avoid="text" className="relative z-10 flex flex-col items-center gap-8 text-center">
        <span className="text-4xl">🌱</span>

        <div className="flex flex-col items-center gap-3">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Prontinho, é só isso!
          </h2>
          <p className="max-w-md text-base text-white/60">
            Recebemos sua ideia com carinho. Agora é só aguardar — em breve
            entramos em contato para conversar sobre os próximos passos.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Prefere falar direto?
          </p>
          <SocialLinks />
        </div>

        <a
          href="#intro"
          className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          Voltar ao início
        </a>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} flideias · feito com calma, um projeto de cada vez
        </p>
      </Container>
    </section>
  )
}
