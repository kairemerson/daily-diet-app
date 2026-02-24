export function buildISODate(date: string, hour: string) {
  const [day, month, year] = date.split("/")
  const [hours, minutes] = hour.split(":")

  const isoDate = new Date(
    Number(year),
    Number(month) - 1, // mês começa em 0
    Number(day),
    Number(hours),
    Number(minutes)
  )

  return isoDate.toISOString()
}
