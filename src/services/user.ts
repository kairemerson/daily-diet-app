import { api } from "./api"

export async function getUserProfileRequest() {
    const response = await api.get("/users/me")

    return response.data
}