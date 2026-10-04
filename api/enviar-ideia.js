// Função da Vercel: POST /api/enviar-ideia (a lógica fica em ./_ideia.js;
// arquivos com "_" na frente não viram rota).
import { processarIdeia } from './_ideia.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false })
  }
  try {
    const { status, json } = await processarIdeia(req.body, process.env)
    return res.status(status).json(json)
  } catch (error) {
    console.error('[enviar-ideia] erro inesperado', error)
    return res.status(500).json({ ok: false, erro: 'erro-interno' })
  }
}
