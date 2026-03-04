import { api } from "./api"

export type CreateMealPlanItems = {
    mealPlanId: string
    name: string
    description?: string
    order: number
    time: string
    targetCalories?: number
    targetProtein?: number
    targetCarbs?: number
    targetFat?: number
}

export type MealPanItemResponse = {
    id: string;
    name: string;
    description: string | null;
    order: number;
    time: string;
    targetCalories: number | null;
    targetProtein: number | null;
    targetCarbs: number | null;
    targetFat: number | null;
    createdAt: Date;
    mealPlanId: string;
}

export async function createMealPanItem(data: CreateMealPlanItems): Promise<MealPanItemResponse> {
    const response = await api.post<MealPanItemResponse>("/meal-plan-items", data)

    return response.data
}

export async function getMealPlanItemByIdRequest(mealPlanItemId: string): Promise<MealPanItemResponse> {
    const response = await api.get<MealPanItemResponse>(`/meal-plan-items/${mealPlanItemId}`)

    return response.data
}