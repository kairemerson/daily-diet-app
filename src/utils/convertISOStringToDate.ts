import dayjs from "../lib/dayjs"

export function convertISOStringToDate(date: string) {
  return dayjs.utc(date).tz("America/Sao_Paulo").format("DD/MM/YYYY")
}