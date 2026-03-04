import { PatientProfile } from "../types/patients"
import { api } from "./api"

export type CreatePatient = {
    name: string
    email: string
    password: string
    goal: "WEIGHT_LOSS" | "HYPERTROPHY" | "REEDUCATION" | "MAINTENANCE"
    birthDate?: string
    height?: number
    targetWeight?: number
    observation?: string
}

export type PatientsResponse = {
    id: string
    name: string
    email: string
    lastActivity: Date
    adherence: number
    totalMeals: number
}

export async function createPatient(data: CreatePatient): Promise<void> {
    const response = await api.post("/patients", data)

    return response.data
}

export async function getPatientsRequest(): Promise<PatientsResponse> {
    const response = await api.get<PatientsResponse>("/patients")

    return response.data
}

export async function getDashboard(patientId: string) {
    const response = await api.get(`/patients/${patientId}/dashboard`)

    return response.data
}

export async function getPatientDashboard() {
    const response = await api.get(`/patients/me/dashboard`)

    return response.data
}