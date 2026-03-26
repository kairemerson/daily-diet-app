import dayjs from "../lib/dayjs"

export function convertDateToHour(date: string) {
  return dayjs.utc(date).tz("America/Sao_Paulo").format("HH:mm")
}