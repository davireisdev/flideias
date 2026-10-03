---
name: flideias
description: Página de captação de leads — conte sua ideia de site, com calma, sob um céu de gradiente violeta.
colors:
  vazio-estelar: "#06060b"
  espaco-profundo: "#0b0b14"
  ardosia-noturna: "#101018"
  cinza-nebular: "#1f1f2b"
  cinza-nebular-claro: "#2a2a3a"
  luz-das-estrelas: "#f4f3fb"
  violeta-profundo: "#8b5cf6"
  violeta-profundo-claro: "#a78bfa"
  nevoa-violeta: "#c4b5fd"
  ametista-profunda: "#7c3aed"
  ametista-escura: "#6d28d9"
  ciano-suave: "#22d3ee"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.05em"
rounded:
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ametista-profunda}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ametista-escura}"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card-panel:
    backgroundColor: "rgba(255,255,255,0.02)"
    rounded: "{rounded.3xl}"
    padding: "32px"
  input-field:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "#ffffff"
    rounded: "{rounded.2xl}"
    padding: "12px 16px"
  nav-pill:
    backgroundColor: "rgba(11,11,20,0.7)"
    rounded: "{rounded.full}"
    padding: "12px 20px"
---

# Design System: flideias

## Overview

**Creative North Star: "A Constelação Quieta"**

O sistema vive num céu quase preto onde a luz não pisca — ela deriva. Grandes nebulosas de gradiente (violeta e ciano, borradas a 120px) flutuam atrás do conteúdo como se o fundo respirasse devagar; nada sobre ele é abrupto. É um espaço confiante e contido, não um palco: a luz existe para orientar o olhar, não para gritar por atenção. Vidro fosco — painéis translúcidos com borda fina e quase nenhuma sombra — substitui a profundidade tradicional por camadas discretas, reforçando a sensação de calma premium em vez de peso corporativo.

A tipografia segue a mesma lógica dupla: Sora nos títulos dá presença geométrica e confiante; Inter no corpo mantém tudo legível e sem fricção. A cor é usada com parcimônia — violeta profundo aparece só onde importa (ação primária, destaque de marca, foco), e o ciano quase nunca sai do fundo, como uma estrela distante que só se nota se você procurar.

**Key Characteristics:**
- Fundo quase preto com nebulosas de gradiente borradas como único elemento decorativo recorrente.
- Painéis de vidro fosco: fundo branco a 2–5% de opacidade, borda de 1px branca a 10%, sem sombra em repouso.
- Cantos generosamente arredondados em toda parte — nunca um canto reto.
- Um único acento vibrante (família violeta) carrega quase todo o peso cromático; ciano é ambiente, não interativo.
- Hierarquia de texto construída por opacidade do branco (100% → 50%, nunca abaixo disso em texto real — ver Named Rule de contraste), não por trocar de cor.

### Exceção deliberada: Intro Showcase
A seção Intro (o carrossel de abertura, ver Components) é intencionalmente mais densa e ilustrada do que o resto do sistema — palavra gigante de fundo, ilustração central, ícones flutuantes, mais camadas de glow. É uma decisão consciente de identidade, não drift: a Formulário, o Encerramento e a Navegação continuam seguindo "A Constelação Quieta" à risca. A paleta não muda (mesmos tokens violeta/ametista/ciano) e **The One Star Rule ainda vale** — o ciano segue fora de texto, contorno e botão mesmo na Intro. O que muda é densidade visual e a presença de ilustração, só ali.

## Colors

Paleta sofisticada e contida: quase monocromática (violeta sobre uma escala de "espaço" quase preto), com o ciano reservado para o fundo, nunca para elementos interativos.

### Primary
- **Violeta Profundo** (`#8b5cf6`): identidade de marca — foco de campos, anel de seleção de cores, ícones de destaque, nome "ideias" no menu. Usada com moderação; é sempre a coisa mais "viva" na tela onde aparece. *Não* é usada como fundo sólido com texto branco em cima — a `#8b5cf6` mede 4.2:1 com branco, abaixo do mínimo AA de 4.5:1 (ver botão abaixo).
- **Violeta Profundo Claro** (`#a78bfa`): hover do nome da marca no menu; um degrau acima em luminosidade, nunca em saturação.
- **Névoa Violeta** (`#c4b5fd`): texto pequeno sobre fundo de destaque — selo "eyebrow", texto do assistente de IA, link "Clique para enviar". É o violeta legível em texto de 12–14px sobre fundo escuro (10.2:1 — muito acima do mínimo AA).

### Secondary
- **Ametista Profunda** (`#7c3aed`): dupla função — dentro das nebulosas de fundo (25% de opacidade) *e* fundo sólido do botão primário, onde mede 5.7:1 com texto branco (AA). É o único lugar da família violeta usado como fundo sólido para texto.
- **Ametista Escura** (`#6d28d9`): estado de hover/pressed do botão primário — mais escura ainda (7.1:1 com branco), reforça a sensação de "afundar" no clique em vez de clarear.
- **Ciano Suave** (`#22d3ee`): segundo ponto de luz da constelação, também só no fundo (10% de opacidade). É a única cor fora da família violeta — usada para lembrar que o céu tem mais de uma estrela, sem competir com o violeta.

### Neutral
- **Vazio Estelar** (`#06060b`): fundo base de toda a página.
- **Espaço Profundo** (`#0b0b14`): superfícies sólidas que precisam se destacar do fundo (menu, modal de vídeo).
- **Ardósia Noturna** (`#101018`): moldura do player de vídeo.
- **Cinza Nebular** (`#1f1f2b`) / **Cinza Nebular Claro** (`#2a2a3a`): trilho e polegar da scrollbar.
- **Luz das Estrelas** (`#f4f3fb`): cor de texto padrão — um branco quente, nunca `#ffffff` puro.

Acima da escala neutra, a hierarquia de texto é feita variando a **opacidade do branco** (`white/70`, `white/60`, `white/50`...) sobre o fundo escuro, não trocando de token. `white/50` é o piso: abaixo disso, texto de 12–14px sobre o Vazio Estelar cai abaixo de 4.5:1 e falha AA (medido: `white/30` = 2.7:1, `white/25` = 2.1:1).

### Named Rules
**The One Star Rule.** Só a família violeta é interativa. Ciano vive exclusivamente no fundo decorativo — se um elemento precisa comunicar "clique aqui" ou "isto está em foco", a resposta é sempre um tom da família violeta (nunca ciano, nunca uma cor nova).

**The AA Floor Rule.** Nenhum texto real (não-decorativo) fica abaixo de `white/50` de opacidade, e nenhum par texto-sobre-cor é usado sem checar 4.5:1 primeiro. Um token "parecer" escuro o suficiente não é verificação — meça.

## Typography

**Display Font:** Sora (com fallback ui-sans-serif, system-ui)
**Body Font:** Inter (com fallback ui-sans-serif, system-ui)

**Character:** Sora dá aos títulos uma geometria confiante e um pouco editorial; Inter mantém o corpo do texto neutro e altamente legível. A dupla existe para que títulos "pesem" mais que o texto ao redor sem precisar de cor ou tamanho exagerado.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, altura de linha 1.1): título principal da Intro — aparece uma única vez por página.
- **Headline** (600, `clamp(1.875rem, 3.5vw, 3rem)`, altura de linha 1.15): título de cada seção (Formulário, Encerramento).
- **Title** (600, `14px`, tracking -0.01em): cabeçalhos pequenos — nome da marca no menu, título do painel do assistente de IA.
- **Body** (400, `14–18px`, altura de linha 1.5): parágrafos, campos de formulário, botões; largura confortável de leitura (~65ch nos parágrafos da Intro).
- **Label** (500, `12px`, tracking 0.05em, uppercase): selo "eyebrow", links do menu, dicas de campo (`hint`), rótulo "Em breve".

### Named Rules
**The Display-Once Rule.** O tamanho Display é reservado ao H1 da Intro. Nenhuma outra seção compete com ele — Headline é o teto para todo o resto, mesmo em telas grandes.

## Layout

Container central de `max-w-6xl` (1152px) com gutter lateral de 24px (`px-6`, 32px em `sm:`). Ritmo vertical generoso entre seções: 96px de padding vertical (`py-24`), 128px em telas ≥640px (`py-32`); a Intro é a exceção, ocupando `min-height: 100vh` para abrir a página em tela cheia.

Dentro de um painel, o espaçamento segue a escala 8/12/16/24/32/48px. O Formulário usa grid de duas colunas em telas grandes (`1.4fr` conteúdo + `1fr` assistente, este último `sticky`) e colapsa para uma coluna única em mobile, com o assistente de IA descendo abaixo do formulário.

Navegação é uma pílula fixa e centralizada no topo (`max-w-3xl`), flutuando 16px abaixo do topo da viewport — nunca ocupa a largura inteira, mesmo em desktop. Toda seção usa `scroll-margin-top` (96px, `scroll-mt-24`) para que um link do menu nunca deixe o título da seção escondido atrás da pílula fixa.

## Elevation & Depth

Sistema **flat por padrão com camadas de vidro discretas**: praticamente nenhum painel usa `box-shadow` em repouso. Profundidade vem de contraste sutil de opacidade (fundo branco a 2–5%) e de uma borda de 1px branca a 10% — não de sombra. `backdrop-blur` é reservado a elementos que **flutuam sobre** o conteúdo (menu fixo, overlay do modal de vídeo), nunca a cards estáticos.

Sombra aparece em só dois lugares, e sempre com propósito: um glow colorido sob o botão primário (sinaliza "isto é a ação principal") e uma sombra escura e ampla sob o player de vídeo e o modal (ancora um elemento de mídia grande visualmente, não decora).

### Shadow Vocabulary
- **Accent glow** (`box-shadow` via `shadow-lg shadow-accent-600/25`): exclusivo do botão primário; comunica "esta é a ação".
- **Grounding shadow** (`shadow-2xl shadow-black/40`): moldura do vídeo e modal — ancora mídia grande, nunca usada em cards de texto.

### Named Rules
**The Flat-Panel Rule.** Cards e painéis de conteúdo (formulário, assistente de IA, moldura da referência) nunca recebem `box-shadow`. Se algo parece precisar de mais destaque, a resposta é ajustar borda/opacidade, não adicionar sombra.

## Shapes

Nenhum canto reto no sistema. Controles interativos (botões, badges, links do menu, seletor de cor, chips de rede social) são sempre `rounded-full` — pílulas. Contêineres maiores (cards, moldura de vídeo) usam `rounded-3xl` (24px); campos de texto e o modal usam `rounded-2xl` (16px); elementos menores como miniaturas de imagem e o campo de referência usam `rounded-xl` (12px).

Bordas são sempre finas (1px) e de baixo contraste (branco a 10–20% de opacidade); a única exceção é a zona de upload de imagens, que usa borda tracejada (`border-dashed`) para sinalizar "solte aqui" sem imitar um campo de texto comum.

O elemento decorativo assinatura do sistema são as **nebulosas de fundo**: três círculos enormes (26–32rem), borrados a 120px, posicionados de forma assimétrica atrás do conteúdo — nunca centralizados o suficiente para parecer um holofote.

## Components

### Buttons
- **Shape:** totalmente arredondado (`rounded-full`, 9999px), sempre.
- **Primary:** fundo Ametista Profunda (não Violeta Profundo — precisa do tom mais escuro para o texto branco passar em 4.5:1 AA), glow de sombra colorida (`shadow-accent-600/25`); hover escurece para Ametista Escura (afunda em vez de clarear).
- **Ghost:** fundo branco a 5% de opacidade, borda de 1px branca a 10%, sem sombra; usado para ações secundárias ("Contar minha ideia" na Intro).
- **Hover / Focus:** transição de 200ms em todas as propriedades; leve `scale-95` no clique (`active:scale-95`) para dar resposta tátil sem exagero.

### Chips / Badges
- **Eyebrow badge:** borda Violeta Profundo a 30%, fundo Violeta Profundo a 10%, texto Névoa Violeta, uppercase, `tracking-wider`, sempre `rounded-full`.
- **Seletor de cor:** círculos de 44px (`h-11 w-11 rounded-full` — piso de alvo de toque); estado selecionado ganha anel Violeta Profundo Claro (`ring-2 ring-accent-400`) e escala 110%.

### Cards / Containers
- **Corner Style:** `rounded-3xl` (24px).
- **Background:** branco a 2–3% de opacidade sobre o Vazio Estelar.
- **Shadow Strategy:** nenhuma — ver Elevation & Depth.
- **Border:** 1px branco a 10%.
- **Internal Padding:** 24px em mobile, 32px em `sm:` e acima.

### Inputs / Fields
- **Style:** fundo branco a 5%, borda de 1px branca a 10%, `rounded-2xl` (textareas) ou `rounded-xl` (inputs de linha única).
- **Focus:** a borda muda para Violeta Profundo a 100% de opacidade (60% media só 2.24:1 — abaixo do piso de 3:1 não-textual) e o fundo clareia ligeiramente (branco a 7%) — sem `outline` do navegador, sem anel de foco separado.
- **Placeholder:** branco a 50% de opacidade (piso AA — ver The AA Floor Rule).
- **Campo de investimento** ("Quanto você pensa em investir?", logo antes do botão de envio): input de linha única com prefixo "R$" em branco a 50% dentro do campo, só números (reais inteiros, milhar formatado "1.500"), mínimo R$ 80 obrigatório. Erro no mesmo padrão da descrição: borda Violeta Profundo Claro a 70% + mensagem em Névoa Violeta ("Coloca um valor a partir de R$ 80 🙂"), mostrado no envio ou ao sair do campo com valor abaixo do mínimo.

### Navigation
- Pílula fixa e centralizada (`rounded-full`, fundo Espaço Profundo a 70% + `backdrop-blur-lg`), com borda de 1px branca a 10%. Links em Inter 500, branco a 70%, ganham fundo branco a 10% e texto 100% no hover. Em mobile a pílula encolhe de largura mas mantém a mesma forma — não vira menu hambúrguer.

### Nebulosa de Fundo (signature)
Três blobs `rounded-full` enormes, borrados (`blur-[120px]`), em Ametista Profunda, Ciano Suave e Violeta Profundo, todos abaixo de 25% de opacidade e posicionados de forma assimétrica atrás do conteúdo. Um gradiente linear final (`transparent` → Vazio Estelar) funde tudo para o preto na base da viewport. É o único elemento verdadeiramente decorativo do sistema — todo o resto é funcional.

### Carrossel de Abertura (Intro Showcase, exceção — ver Overview)
Substitui o hero estático na Intro. Por slide: uma **ilustração central** (círculo de vidro fosco com glow — hoje um ícone lucide de placeholder + legenda "ilustração: X", pronto pra virar `<img>` real; ícone e legenda com `gap-7` entre si pra nunca sobrepor), **ícones flutuantes** ao redor (círculos pequenos de vidro fosco, escondidos abaixo de `sm:`), e logo abaixo do círculo — em fluxo normal, não sobreposta — a **palavra gigante** (Sora extrabold, `10vw`→`6vw` conforme a tela, branco a 15%). Setas translúcidas nas laterais e dots embaixo trocam de slide; o texto e o CTA mudam junto. Cores continuam só violeta/ametista/ciano-no-fundo — nenhuma cor nova entrou.

**Autoplay**: avança sozinho a cada 3s, pausa no hover ou foco por teclado (`onMouseEnter`/`onFocus` no `<section>`), e não roda sob `prefers-reduced-motion` — troca de slide automática é conteúdo auto-atualizável, então precisa de como parar (WCAG 2.2.2).

Animação via GSAP: entrada com `back.out` nos ícones (staggered) e `power3.out` na palavra/ilustração ao trocar de slide; flutuação contínua dos ícones (`sine.inOut`, y ±10px, loop). Ambas desligam sob `prefers-reduced-motion` — a troca de slide vira instantânea, o loop de flutuação simplesmente não inicia.

### Voltar ao Início (Encerramento)
Pílula discreta (`ArrowUp` + "Voltar ao início") entre os contatos e o copyright, linkando pra `#intro`. Mesmo tratamento visual do botão ghost — sem competir com os CTAs de WhatsApp/e-mail/Instagram acima dela.

### Glow d'Água (cursor, Formulário e Encerramento)
Um glow violeta (`accent-500/15`, `blur-[100px]`) que segue o cursor com atraso (`lerp` a 7% por frame) em vez de grudar nele — a sensação de líquido escorrendo atrás do ponteiro, não uma luz colada no mouse. Só em desktop com mouse de verdade (`hover: hover` + `pointer: fine`); desliga inteiro sob `prefers-reduced-motion`, já que é decoração pura sem função. Não aparece sobre a Intro (que tem fundo próprio opaco) — só de Formulário pra baixo.

## Do's and Don'ts

### Do:
- **Do** manter o violeta como a única cor interativa; ciano e ametista ficam no fundo.
- **Do** usar opacidade de branco (não uma nova cor) para criar hierarquia de texto.
- **Do** arredondar tudo — pílula para controles, `rounded-3xl` para painéis, nunca cantos retos.
- **Do** reservar sombra para o botão primário (glow) e para mídia grande (grounding shadow).
- **Do** medir contraste (4.5:1 para texto normal) antes de usar um novo par cor-sobre-cor, especialmente texto branco sobre um tom da família violeta.

### Don't:
- **Don't** adicionar `box-shadow` a cards ou painéis de conteúdo — a profundidade vem de borda + opacidade, não de sombra.
- **Don't** usar branco puro (`#ffffff`) como cor de texto de corpo — o padrão é Luz das Estrelas (`#f4f3fb`) ou branco com opacidade reduzida.
- **Don't** introduzir uma segunda cor de ação. Um CTA nunca compete em cor com o botão primário.
- **Don't** aplicar `backdrop-blur` a elementos que não estão flutuando sobre o conteúdo (cards estáticos ficam de fora).
