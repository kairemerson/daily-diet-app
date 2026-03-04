import { api } from "./api";

export type CreateBodyMetricsData = {
    patientId: string
    weight?: number
    bodyFat?: number
    muscleMass?: number
    recordedAt?: string
}

export type BodyMetrics = {
    id: string;
    weight: number | null;
    bodyFat: number | null;
    muscleMass: number | null;
    recordedAt: Date;
    patientId: string;
}

export type CalculatedBodyMetrics = {
    currentWeight: number | null;
    initialWeight: number | null;
    weightDifference: number | null;
    currentBodyFat: number | null;
    currentMuscleMass: number | null;
}

export async function createBodyMetricsRequest(data: CreateBodyMetricsData): Promise<BodyMetrics> {
    const response = await api.post<BodyMetrics>("/body-metrics", data)

    return response.data
}

export async function getBodyMetricsRequest(patientId: string): Promise<CalculatedBodyMetrics> {
    const response = await api.get<CalculatedBodyMetrics>(`/body-metrics/${patientId}`)

    return response.data
}