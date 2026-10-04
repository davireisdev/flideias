// Envio do formulário para /api/enviar-ideia (função da Vercel → e-mail).
// As imagens são reduzidas no navegador antes de sair: a função da Vercel
// aceita no máximo ~4,5 MB por envio, e uma foto de celular sozinha passa disso.
export const MAX_IMAGES = 8
const MAX_SIDE = 1280
const QUALITY = 0.8

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function comprimir(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff' // PNG transparente vira fundo branco, não preto
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY))
  return {
    nome: `${file.name.replace(/\.[^.]+$/, '').slice(0, 60) || 'inspiracao'}.jpg`,
    tipo: 'image/jpeg',
    base64: await blobToBase64(blob),
  }
}

/** Envia a ideia. Lança erro se não deu certo (o formulário mostra o aviso). */
export async function enviarIdeia({ images, ...campos }) {
  const imagens = await Promise.all(images.slice(0, MAX_IMAGES).map((image) => comprimir(image.file)))
  const resposta = await fetch('/api/enviar-ideia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...campos, imagens }),
  })
  const json = await resposta.json().catch(() => ({}))
  if (!resposta.ok || !json.ok) throw new Error(json.erro || `HTTP ${resposta.status}`)
  return json
}
