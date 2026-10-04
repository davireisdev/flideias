// Recebe uma ideia do formulário, valida de novo (nunca confiar só no
// navegador) e manda para o Davi por e-mail via Resend, com as imagens de
// inspiração anexadas. Usado pela função da Vercel (api/enviar-ideia.js) e,
// em desenvolvimento, pelo servidor do Vite (vite.config.js).
//
// Variáveis de ambiente (na Vercel: Settings → Environment Variables):
//   RESEND_API_KEY  chave do Resend (sem ela, o envio responde 503 e o site
//                   mostra o aviso de erro — nada finge que deu certo)
//   IDEIAS_PARA     e-mail que recebe as ideias (sem domínio próprio no
//                   Resend, tem que ser o mesmo e-mail da conta do Resend)
//   IDEIAS_DE       remetente; padrão "flideias <onboarding@resend.dev>"
import fs from 'node:fs'
import path from 'node:path'

const MIN_BUDGET = 80 // mesmo mínimo de src/components/form/BudgetField.jsx
const MAX_IMAGES = 8
const MIN_FILL_MS = 3000 // ninguém lê, escreve e envia em menos de 3 s
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const COLORS = ['Escuro e sofisticado', 'Claro e neutro', 'Azul, confiança', 'Verde, natural', 'Quente, energético', 'Rosa, delicado']

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export function validar(body) {
  if (!body || typeof body !== 'object') return { erros: ['corpo inválido'] }
  const dados = {
    descricao: text(body.descricao, 8000),
    cores: Array.isArray(body.cores) ? body.cores.filter((c) => COLORS.includes(c)).slice(0, COLORS.length) : [],
    notasCores: text(body.notasCores, 1000),
    referencias: Array.isArray(body.referencias) ? body.referencias.map((r) => text(r, 500)).filter(Boolean).slice(0, 10) : [],
    investimento: Number.parseInt(body.investimento, 10),
    nome: text(body.nome, 120),
    whatsapp: text(body.whatsapp, 20).replace(/\D/g, ''),
    email: text(body.email, 200),
    imagens: Array.isArray(body.imagens) ? body.imagens.slice(0, MAX_IMAGES) : [],
  }

  const erros = []
  if (!dados.descricao) erros.push('descrição vazia')
  if (!Number.isFinite(dados.investimento) || dados.investimento < MIN_BUDGET || dados.investimento > 9_999_999) erros.push('investimento inválido')
  if (dados.nome.length < 2) erros.push('nome inválido')
  if (dados.whatsapp.length !== 10 && dados.whatsapp.length !== 11) erros.push('WhatsApp inválido')
  if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push('e-mail inválido')

  dados.imagens = dados.imagens.flatMap((img, i) => {
    if (!img || !IMAGE_TYPES.includes(img.tipo) || typeof img.base64 !== 'string') return []
    const bytes = Math.floor((img.base64.length * 3) / 4)
    if (bytes > MAX_IMAGE_BYTES) return []
    const nome = text(img.nome, 80).replace(/[^\w.\- ]+/g, '_') || `inspiracao-${i + 1}.jpg`
    return [{ nome, base64: img.base64 }]
  })
  return { erros, dados }
}

const brl = (n) => `R$ ${n.toLocaleString('pt-BR')}`
const whatsappFormatado = (d) => (d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`)

export function montarEmail(d) {
  const primeiroNome = d.nome.split(' ')[0]
  const wa = `https://wa.me/55${d.whatsapp}?text=${encodeURIComponent(`Oi, ${primeiroNome}! Aqui é o Davi, da flideias. Recebi sua ideia de site 🙂`)}`
  const linha = (rotulo, valor) => (valor ? `<tr><td style="padding:6px 12px 6px 0;color:#6b6b80;white-space:nowrap;vertical-align:top">${rotulo}</td><td style="padding:6px 0;color:#16161f">${valor}</td></tr>` : '')
  const refs = d.referencias
    .map((r) => (/^https?:\/\//i.test(r) ? `<a href="${escapeHtml(r)}" style="color:#7c3aed">${escapeHtml(r)}</a>` : escapeHtml(r)))
    .join('<br>')

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;background:#f4f3fb;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;color:#7c3aed;font-weight:bold;letter-spacing:.08em;font-size:12px">FLIDEIAS · NOVA IDEIA</p>
  <h1 style="margin:0 0 16px;font-size:22px;color:#16161f">${escapeHtml(d.nome)} quer um site</h1>
  <a href="${wa}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold">Responder no WhatsApp</a>
  <table style="margin:20px 0;border-collapse:collapse;font-size:14px">
    ${linha('Nome', escapeHtml(d.nome))}
    ${linha('WhatsApp', escapeHtml(whatsappFormatado(d.whatsapp)))}
    ${linha('E-mail', d.email ? `<a href="mailto:${escapeHtml(d.email)}" style="color:#7c3aed">${escapeHtml(d.email)}</a>` : '<span style="color:#9a9aad">não informado</span>')}
    ${linha('Investimento', escapeHtml(brl(d.investimento)))}
    ${linha('Cores', escapeHtml(d.cores.join(' · ')))}
    ${linha('Sobre as cores', escapeHtml(d.notasCores))}
    ${linha('Referências', refs)}
    ${linha('Imagens', d.imagens.length ? `${d.imagens.length} em anexo` : '')}
  </table>
  <h2 style="margin:0 0 8px;font-size:15px;color:#16161f">A ideia</h2>
  <div style="background:#fff;border-radius:12px;padding:16px;color:#16161f;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(d.descricao)}</div>
</div></body></html>`

  const textoPlano = [
    `Nova ideia de site — ${d.nome}`,
    `WhatsApp: ${whatsappFormatado(d.whatsapp)} (${wa})`,
    `E-mail: ${d.email || 'não informado'}`,
    `Investimento: ${brl(d.investimento)}`,
    d.cores.length ? `Cores: ${d.cores.join(', ')}` : '',
    d.notasCores ? `Sobre as cores: ${d.notasCores}` : '',
    d.referencias.length ? `Referências:\n${d.referencias.join('\n')}` : '',
    d.imagens.length ? `Imagens: ${d.imagens.length} em anexo` : '',
    '',
    'A ideia:',
    d.descricao,
  ]
    .filter((l) => l !== '')
    .join('\n')

  return {
    subject: `Nova ideia de site — ${d.nome} (${brl(d.investimento)})`,
    html,
    text: textoPlano,
    attachments: d.imagens.map((img) => ({ filename: img.nome, content: img.base64 })),
  }
}

/**
 * @param body corpo JSON recebido
 * @param env variáveis de ambiente
 * @param opcoes.testeLocal em desenvolvimento sem chave: salva o e-mail em
 *        tmp-envios/ em vez de enviar (nunca usado no site publicado)
 */
/** Robô? Campo-isca preenchido ou formulário enviado rápido demais. */
export function pareceRobo(body) {
  if (!body || typeof body !== 'object') return false
  const iscaPreenchida = typeof body.site === 'string' && body.site.trim() !== ''
  const tempo = Number(body.tempo)
  return iscaPreenchida || (Number.isFinite(tempo) && tempo < MIN_FILL_MS)
}

export async function processarIdeia(body, env, { testeLocal = false } = {}) {
  // Responde "ok" para o robô não aprender a desviar — só não envia nada.
  if (pareceRobo(body)) {
    console.warn('[enviar-ideia] envio descartado: parece robô')
    return { status: 200, json: { ok: true } }
  }
  const { erros, dados } = validar(body)
  if (erros.length) return { status: 400, json: { ok: false, erro: 'dados-invalidos', detalhes: erros } }

  const email = montarEmail(dados)

  if (testeLocal) {
    const pasta = path.resolve('tmp-envios', new Date().toISOString().replace(/[:.]/g, '-'))
    fs.mkdirSync(pasta, { recursive: true })
    fs.writeFileSync(path.join(pasta, 'email.html'), email.html)
    fs.writeFileSync(path.join(pasta, 'email.txt'), `${email.subject}\n\n${email.text}`)
    for (const a of email.attachments) fs.writeFileSync(path.join(pasta, a.filename), Buffer.from(a.content, 'base64'))
    return { status: 200, json: { ok: true, teste: true } }
  }

  if (!env.RESEND_API_KEY || !env.IDEIAS_PARA) {
    console.error('[enviar-ideia] RESEND_API_KEY ou IDEIAS_PARA não configurados')
    return { status: 503, json: { ok: false, erro: 'nao-configurado' } }
  }

  const resposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.IDEIAS_DE || 'flideias <onboarding@resend.dev>',
      to: [env.IDEIAS_PARA],
      reply_to: dados.email || undefined,
      ...email,
    }),
  })
  if (!resposta.ok) {
    console.error('[enviar-ideia] Resend respondeu', resposta.status, await resposta.text())
    return { status: 502, json: { ok: false, erro: 'falha-no-envio' } }
  }
  return { status: 200, json: { ok: true } }
}
