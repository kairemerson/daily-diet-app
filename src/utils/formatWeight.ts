export function formatWeight(value: string) {
  const numbers = value.replace(/\D/g, "")

  if (!numbers) return ""

  const limited = numbers.slice(0, 5) // limite opcional

  if (limited.length <= 2) {
    return limited
  }

  const integer = limited.slice(0, -2)
  const decimal = limited.slice(-2)

  return `${integer},${decimal}`
}