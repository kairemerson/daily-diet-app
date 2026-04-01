import { api } from "./api"

export type CreateNutritionistProfile = {
    crn: string
    specialty?: string
    clinic?: string
    phone?: string
}

export type UpdateNutritionistProfile = {
    crn: string
    specialty?: string
    clinic?: string
    phone?: string
}

export type NutritionistProfile = {
    nutritionistProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        crn: string | null;
        specialty: string | null;
        clinic: string | null;
        phone: string | null;
    }
}


export async function createNutritionistProfileRequest(data: CreateNutritionistProfile): Promise<void> {
    const response = await api.post("/nutritionists/profile", data)

    return response.data
}

export async function getNutritionistProfileRequest(): Promise<NutritionistProfile> {
    const response = await api.get("/nutritionists/profile")

    return response.data
}

export async function updateNutritionistProfileRequest(data: UpdateNutritionistProfile) {
    const response = await api.put("/nutritionists/profile", data)

    return response.data
}