// How Davi gets back to the visitor: name and WhatsApp are required (his main
// channel), e-mail is optional. WhatsApp keeps raw digits in state and shows
// them masked the Brazilian way: (12) 99999-9999.
export const isNameValid = (value) => value.trim().length >= 2
export const isWhatsappValid = (digits) => digits.length === 10 || digits.length === 11
export const isEmailValid = (value) => !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export function normalizeWhatsapp(value) {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2) // +55 pasted in
  return digits.slice(0, 11)
}

export function formatWhatsapp(digits) {
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)
  if (rest.length <= 4) return `(${ddd}) ${rest}`
  const split = digits.length === 11 ? 5 : 4
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`
}
