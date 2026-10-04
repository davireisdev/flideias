// Content for the Intro showcase carousel. `centralIcon`/`floatingIcons` are
// lucide-react placeholder stand-ins for the real illustrations (brain,
// mascot, lightbulbs, envelopes...) — swap the <CentralIllustration>/
// <FloatingIcon> render in IntroSection.jsx for real <img> tags once the
// asset files exist, no other structural change needed.
export const introSlides = [
  {
    id: 'ideia',
    bgWord: 'IDEIA',
    centralIcon: 'Brain',
    floatingIcons: [
      { icon: 'Lightbulb', position: 'top-[8%] right-[18%]' },
      { icon: 'Lightbulb', position: 'top-[38%] left-[6%]' },
      { icon: 'Lightbulb', position: 'bottom-[14%] right-[10%]' },
    ],
    title: 'Você tem uma ideia',
    cta: { label: 'Começar agora', href: '#formulario' },
  },
  {
    id: 'inteligencia',
    bgWord: 'INTELIGÊNCIA',
    centralIcon: 'Bot',
    floatingIcons: [
      { icon: 'Palette', position: 'top-[10%] left-[14%]' },
      { icon: 'Link2', position: 'top-[6%] right-[16%]' },
      { icon: 'Sparkles', position: 'bottom-[18%] left-[10%]' },
    ],
    title: 'Descreva sua ideia e defina suas cores e funções',
    cta: { label: 'Contar minha ideia', href: '#formulario' },
  },
  {
    id: 'enviado',
    bgWord: 'ENVIADO',
    centralIcon: 'Bot',
    floatingIcons: [
      { icon: 'Mail', position: 'top-[10%] left-[10%]' },
      { icon: 'Mail', position: 'bottom-[16%] right-[12%]' },
      { icon: 'CheckCircle2', position: 'top-[14%] right-[16%]' },
    ],
    title: 'Envie sua ideia pra ser feita',
    cta: { label: 'Aguardando retorno', href: '#formulario' },
  },
]
