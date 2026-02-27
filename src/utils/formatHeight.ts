export function formatHeight(value: string) {
  // remove tudo que não for número
  const numbers = value.replace(/\D/g, "")

  if (!numbers) return ""

  // limita a 3 dígitos (ex: 175)
  const limited = numbers.slice(0, 3)

  if (limited.length <= 1) return limited

  return `${limited.slice(0, 1)},${limited.slice(1)}`
}