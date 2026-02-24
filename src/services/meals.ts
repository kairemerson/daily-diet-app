import { api } from "./api"

export type CreateMealDTO = {
    name: string
    description?: string
    date: string
    isOnDiet: boolean
}

export type Meal = {
  id: string
  name: string
  description: string
  date: string
  isOnDiet: boolean
  createdAt: string
  updatedAt: string
}

interface MetricsResponse {
  total: number
  totalOnDiet: number
  totalOffDiet: number
  bestSequence: number
  percentageOnDiet: number
}


export async function createMealRequest(data: CreateMealDTO): Promise<Meal> {
    const response = await api.post("/meals", data)

    return response.data
}

export async function getMealsRequest(): Promise<Meal[]> {
    const response = await api.get("/meals")

    return response.data
}

export async function getMealByIdRequest(id: string): Promise<Meal> {
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