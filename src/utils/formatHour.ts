import dayjs from "dayjs";

export function formatHourInput(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 4);


  if (numbers.length <= 2) return numbers;

  return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
}

export function formatHour(date: string) {
  return dayjs(date).format("HH:mm")
}
