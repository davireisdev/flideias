# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: pessoas físicas e donos de pequenos negócios que querem um site novo mas muitas vezes não sabem como descrever o que precisam. Chegam à página (via indicação, redes sociais ou contato direto com o freelancer) para deixar uma ideia inicial antes de qualquer conversa.

Secondary: davi (marca "flideias"), freelancer que opera sozinho e revisa cada envio manualmente para dar continuidade ao contato.

## Product Purpose

Landing page de captação de leads para o freelancer davi (flideias). Substitui o primeiro contato genérico ("me manda uma mensagem") por um mini-briefing guiado onde o visitante descreve livremente a ideia do site, cores desejadas, referências e imagens de inspiração — reduzindo o atrito de quem não sabe por onde começar a explicar o que quer. Sucesso é o visitante preencher e enviar o formulário com informação suficiente para davi iniciar o projeto sem múltiplas idas e vindas.

## Positioning

Em vez de um formulário de contato genérico (nome/e-mail/mensagem) ou um link de agendamento direto, a página conduz o visitante por um briefing de resposta livre — sem checklist engessado — com tom leve e sem pressão de venda. Um assistente de IA (ainda não implementado) vai futuramente ajudar a pessoa a lapidar a ideia enquanto ela escreve, o que nenhum formulário de contato tradicional oferece.

## Operating Context

Fluxo do visitante: assiste a um vídeo curto de introdução → lê a seção de formulário → preenche descrição aberta, seleciona/descreve cores, adiciona referências e sobe imagens de inspiração → envia (hoje o envio só guarda estado local, sem back-end) → vê uma seção de encerramento leve com os contatos de flideias para quem preferir falar direto.

Davi atende sozinho, sem equipe ou processo de vendas formal; cada lead recebido é respondido manualmente por ele.

## Capabilities and Constraints

- Envio do formulário: propositalmente sem back-end/e-mail conectado ainda. É uma questão de tempo, não uma restrição de ferramenta — não há serviço (Resend, EmailJS, CRM etc.) já decidido.
- Assistente de IA: componente reservado (`AIAssistantPanel`) sem lógica implementada; entra depois, sem requisitos definidos ainda.
- Upload de imagens de inspiração é local (preview via object URL no navegador); não há armazenamento remoto ainda.
- Site é single-page com 3 seções (Intro, Formulário, Encerramento) e scroll suave entre elas.

## Brand Commitments

- Nome da marca: **flideias** (combinação de "fl" + "ideias").
- WhatsApp: +55 12 99198-0766 (`https://wa.me/5512991980766`)
- E-mail: davigabrielreis09@gmail.com
- Instagram: @davireisdev
- LinkedIn removido do rodapé por enquanto (canal pode voltar depois, a pedido do usuário).

## Evidence on Hand

Nenhum case, depoimento, portfólio ou prova social cadastrado ainda — não inventar nenhum até que seja fornecido. Vídeo de introdução ainda não foi adicionado (placeholder esperado em `public/videos/apresentacao.mp4`; o player já trata a ausência do arquivo com um estado "vídeo em breve").

## Product Principles

1. Sem pressão de venda — tom leve, especialmente no encerramento ("prontinho, agora é só esperar").
2. Resposta livre antes de estrutura rígida — o visitante descreve com as próprias palavras, sem formulário engessado tipo checklist.
3. Atendimento pessoal — davi é quem responde depois; o site é o primeiro contato, não um funil automatizado de fechamento.
4. Simplicidade acima de automação — prioridade é um formulário funcional e bem cuidado, não uma stack de CRM/automação.
