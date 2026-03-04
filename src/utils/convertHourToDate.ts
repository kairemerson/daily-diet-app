export function convertHourToDate(hourString: string) {
  const [hours, minutes] = hourString.split(":").map(Number)

  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date.toISOString()
}