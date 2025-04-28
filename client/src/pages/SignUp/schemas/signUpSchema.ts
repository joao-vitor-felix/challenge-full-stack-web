import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    role: z.enum(["REGISTRAR", "PROFESSOR"], {
      errorMap: () => ({ message: "O cargo é obrigatório" })
    }),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8, "A confirmação de senha é obrigatória")
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
