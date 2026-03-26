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

export type UpdateMealPlanDTO = {
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
    mealPlanItems: {
        id: string;
        description: string | null;
        name: string;
        targetCalories: number | null;
        targetProtein: number | null;
        targetCarbs: number | null;
        targetFat: number | null;
        mealPlanId: string;
        time: string;
    }[];
}

export async function createMealPlanRequest(data: CreateMealPlanDTO): Promise<MealPlan> {
    const response = await api.post<MealPlan>("/meal-plans", data)

    return response.data
}

export async function getMealPlansByPatientRequest(patientId: string): Promise<MealPlanWithMealPlanItems[]> {
  const response = await api.get<MealPlanWithMealPlanItems[]>(`/patients/${patientId}/meal-plans`)

  return response.data
}

export async function getMealPlanByIdRequest(mealPlanId: string): Promise<MealPlanWithMealPlanItems> {
  const response = await api.get(`/meal-plans/${mealPlanId}`)

  return response.data
}

export async function updateMealPlanRequest(id: string, data: UpdateMealPlanDTO): Promise<MealPlan> {
  const response = await api.put<MealPlan>(`/meal-plans/${id}`, data)

  return response.data
}