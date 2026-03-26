import dayjs from "dayjs"

export function buildDateTime(date: string, time: string) {
  const [day, month, year] = date.split("/")
  return dayjs(`${year}-${month}-${day}T${time}`).format("YYYY-MM-DDTHH:mm:ss")
}