import { api } from "./api";

export type SignUpDTO = {
    name: string
    email: string
    password: string
}

export async function signUpRequest(data: SignUpDTO) {
    const response = await api.post("/users", data)

    return response.data

}

export async function signInRequest(data: {
        email: string 
        password: string
    }) {
    const response = await api.post("/sessions", data)    
    return response.data
}