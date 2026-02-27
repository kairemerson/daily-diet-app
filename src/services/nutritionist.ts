import { api } from "./api"

export type CreateNutritionistProfile = {
    crn: string
    specialty?: string
    clinic?: string
    phone?: string
}


export async function createNutritionistProfileRequest(data: CreateNutritionistProfile): Promise<void> {
    const response = await api.post("/nutritionists/profile", data)

    return response.data
}