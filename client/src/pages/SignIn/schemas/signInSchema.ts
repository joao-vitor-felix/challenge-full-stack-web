import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres")
});

export type SignInSchema = z.infer<typeof signInSchema>;
