import {z} from "zod"

export const mealSchema = z.object({
    name: z.string().min(3, "Infome o nome!"),
    description: z.string().optional(),
    date: z.string().min(1, "Informe a data!"),
    hour: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
    isOnDiet: z.boolean()
})

export type MealFormData = z.infer<typeof mealSchema>