import {z} from "zod"

export const mealSchema = z.object({
    name: z.string().min(3, "Infome o nome!"),
    description: z.string().optional(),
    date: z.string().min(1, "Informe a data!"),
    time: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
    isOnDiet: z.boolean(),
    consumedFat: z
        .preprocess((value) => {
        if (value === "" || value === null || value === undefined) return 0;
        return Number(value);
        }, z.number().min(0, "O valor não pode ser negativo"))
        .default(0),

    consumedProtein: z
        .preprocess((value) => {
        if (value === "" || value === null || value === undefined) return 0;
        return Number(value);
        }, z.number().min(0, "O valor não pode ser negativo"))
        .default(0),

    consumedCarbs: z
        .preprocess((value) => {
        if (value === "" || value === null || value === undefined) return 0;
        return Number(value);
        }, z.number().min(0, "O valor não pode ser negativo"))
        .default(0),

    consumedCalories: z
        .preprocess((value) => {
        if (value === "" || value === null || value === undefined) return 0;
        return Number(value);
        }, z.number().min(0, "O valor não pode ser negativo"))
        .default(0),
})

export type MealFormData = z.infer<typeof mealSchema>