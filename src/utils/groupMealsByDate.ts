import dayjs from "dayjs"
import { Meal } from "../services/meals"

export function groupMealsByDate(meals: Meal[]) {
  const grouped = meals.reduce((acc, meal) => {
    const formattedDate = dayjs(meal.date).format("DD.MM.YY")

    if (!acc[formattedDate]) {
      acc[formattedDate] = []
    }

    acc[formattedDate].push(meal)

    return acc
  }, {} as Record<string, Meal[]>)

  return Object.entries(grouped).map(([date, meals]) => ({
    title: date,
    data: meals.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  }))
}
