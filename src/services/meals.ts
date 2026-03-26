import { api } from "./api"

export type CreateMealDTO = {
    name: string
    description?: string
    date: string
    time: string
    isOnDiet: boolean
    mealPlanItemId?: string,
    consumedCalories?: number
    consumedProtein?: number
    consumedCarbs?: number
    consumedFat?: number
}

export type Meal = {
  id: string
  name: string
  description: string
  date: string
  time: string
  isOnDiet: boolean
  createdAt: string
  updatedAt: string
}

export type MealWithMacrosResponse = Meal & {
    consumedCalories?: number
    consumedProtein?: number
    consumedCarbs?: number
    consumedFat?: number
}

interface MetricsResponse {
  total: number
  totalOnDiet: number
  totalOffDiet: number
  bestSequence: number
  percentageOnDiet: number
}

export type MealsSection = {
    title: string
    data: Meal[]
}


export async function createMealRequest(data: CreateMealDTO): Promise<Meal> {
    const response = await api.post("/meals", data)

    return response.data
}

export async function getMealsRequest(): Promise<MealsSection[]> {
    const response = await api.get("/meals")

    return response.data
}

export async function getMealsByPatientIdRequest(patientId: string): Promise<MealsSection[]> {
    const response = await api.get(`/meals/patient/${patientId}`)

    return response.data
}

export async function getMealByIdRequest(id: string): Promise<MealWithMacrosResponse> {
    const response = await api.get(`/meals/${id}`)

    return response.data
}

export async function getMealsMetricsRequest(): Promise<MetricsResponse> {
    const response = await api.get("/meals/metrics")

    return response.data
}

export async function updateMealRequest(id: string, data: CreateMealDTO): Promise<Meal> {
    const response = await api.put(`/meals/${id}`, data)

    return response.data
}

export async function deleteMealRequest(id: string): Promise<void> {
    await api.delete(`/meals/${id}`)
}