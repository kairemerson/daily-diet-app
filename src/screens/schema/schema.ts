import {z} from "zod"

export const mealSchema = z.object({
    name: z.string().min(3, "Infome o nome!"),
    description: z.string().optional(),
    date: z.string().min(1, "Informe a data!"),
    time: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
    isOnDiet: z.boolean(),
    consumedCalories: z.number().optional(),
    consumedProtein: z.number().optional(),
    consumedCarbs: z.number().optional(),
    consumedFat: z.number().optional(),
})

export type MealFormData = z.infer<typeof mealSchema>