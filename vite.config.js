import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { processarIdeia } from './api/_ideia.js'

// Em desenvolvimento, o Vite responde POST /api/enviar-ideia com a mesma
// lógica da função da Vercel. Sem RESEND_API_KEY no .env.local, o e-mail é
// salvo em tmp-envios/ em vez de enviado — dá pra testar tudo sem a conta.
function enviarIdeiaEmDev() {
  return {
    name: 'enviar-ideia-dev',
    configureServer(server) {
      server.middlewares.use('/api/enviar-ideia', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end()
        }
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        let body = null
        try {
          body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        } catch {
          // corpo inválido: processarIdeia responde 400
        }
        const env = loadEnv('development', process.cwd(), '')
        const { status, json } = await processarIdeia(body, env, { testeLocal: !env.RESEND_API_KEY })
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(json))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), enviarIdeiaEmDev()],
})
