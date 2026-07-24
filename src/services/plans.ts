import { api } from "./api";

export type Plan = {
    id: string;
    title: string;
    description: string;
    price: string;
    interval: string | undefined;
    highlight: boolean;
}
export async function getPlans():Promise<Plan[]> {
    console.log("chamou getPlans");
    
    const response = await api.get("/plans")

    return response.data
}