export function convertHourToDate(hourString: string) {
  const [hours, minutes] = hourString.split(":").map(Number)

  return new Date(0, 0, 0, Number(hours), Number(minutes))
}