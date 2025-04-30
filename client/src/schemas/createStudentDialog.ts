import { z } from "zod";

export const createStudentSchema = z.object({
  ra: z
    .string()
    .min(11, "O RA deve conter 11 caracteres")
    .max(11, "O RA deve conter 11 caracteres"),
  cpf: z
    .string()
    .min(11, "O CPF deve conter 11 caracteres")
    .max(11, "O CPF deve conter 11 caracteres"),
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido")
});

export type CreateStudentSchema = z.infer<typeof createStudentSchema>;
