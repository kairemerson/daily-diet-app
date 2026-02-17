import {z} from "zod"

export const signUpSchema = z.object({
    name: z.string("Infome seu nome!").min(3, "O nome precisa ter pelo menos 3 caracteres!"),
    email: z.email("Infome um email válido!"),
    password: z.string("Informe a senha!").min(6, "A senha deve ter pelo menos 6 caracteres!"),
})

export type SignUpFormData = z.infer<typeof signUpSchema>