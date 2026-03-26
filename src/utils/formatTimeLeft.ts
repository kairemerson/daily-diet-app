export function formatTimeLeft(minutes: number) {
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours}h ${mins}min`
}