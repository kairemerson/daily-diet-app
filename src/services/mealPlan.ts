import { api } from "./api";

export type CreateMealPlanDTO = {
  patientId: string
  title: string
  description?: string
  caloriesTarget?: number
  proteinTarget?: number
  carbsTarget?: number
  fatTarget?: number
  startDate: string
  endDate?: string
}

export type MealPlan = {
  id: string
  patientId: string
  nutritionistId: string
  title: string
  description: string | null
  caloriesTarget: number | null
  proteinTarget: number | null
  carbsTarget: number | null
  fatTarget: number | null
  startDate: string
  endDate: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type MealPlanWithMealPlanItems = MealPlan & {
    meals: {
        id: string;
        description: string | null;
        name: string;
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
        mealPlanId: string;
        time: string;
    }[];
}

export async function createMealPlanRequest(data: CreateMealPlanDTO): Promise<MealPlan> {
    const response = await api.post<MealPlan>("/meal-plans", data)

    return response.data
}

export async function getMealPlanRequest(patientId: string): Promise<MealPlanWithMealPlanItems[]> {
  const response = await api.get<MealPlanWithMealPlanItems[]>(`/meal-plans/${patientId}`)

  return response.data
}