import dayjs from "dayjs";

export function convertDateToHour(date: string) {

  return dayjs(date).format("HH:mm")
}