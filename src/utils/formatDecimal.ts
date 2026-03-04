export function formatDecimal(value: string) {
  const numbers = value.replace(/\D/g, "")

  if (!numbers) return ""

  const limited = numbers.slice(0, 5) // limite opcional

  if (limited.length <= 2) return limited

  return `${limited.slice(0, -2)}.${limited.slice(-2)}`
}