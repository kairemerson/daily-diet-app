import { PatientProfile, PatientStatus } from "../types/patients"
import { api } from "./api"
import { MealPlanWithMealPlanItems } from "./mealPlan"

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
    lastActivity: string
    adherence: number
    totalMeals: number
}

export type DashboardResponse = {
  adherence: {
    last7Days: number;
  };
  mealPlans: MealPlanWithMealPlanItems[];
  metrics: {
    currentBodyFat: number;
    currentMuscleMass: number;
    currentWeight: number;
    weightDifference: number;
  };
  patient: Pick<CreatePatient, "name" | "goal" | "targetWeight" | "observation"> & {
    id: string;
    status: PatientStatus
  };
};

export async function createPatient(data: CreatePatient): Promise<void> {
    const response = await api.post("/patients", data)

    return response.data
}

export async function getPatientsRequest(): Promise<PatientsResponse[]> {
    const response = await api.get<PatientsResponse[]>("/patients")

    return response.data
}

export async function getDashboard(patientId: string): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(`/patients/${patientId}/dashboard`)

    return response.data
}

export async function getPatientDashboard() {
    const response = await api.get(`/patients/me/dashboard`)

    return response.data
}

export async function updatePatientStatus(patientId: string, status: PatientStatus) {
  const response = await api.patch(`/patients/${patientId}/status`, {status})

  return response.data
}