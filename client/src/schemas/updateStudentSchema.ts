import { z } from "zod";

export const updateStudentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").optional(),
  email: z.string().email("E-mail inválido").optional()
});

export type UpdateStudentSchema = z.infer<typeof updateStudentSchema>;
