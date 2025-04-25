import { z } from "zod";

export const createStudentSchema = z
  .object({
    ra: z
      .string({
        message: "ra must be a string"
      })
      .min(11, "ra is required"),
    cpf: z
      .string({
        message: "cpf must be a string"
      })
      .min(11, "cpf is required"),
    name: z
      .string({
        message: "name must be a string"
      })
      .min(1, "name is required"),
    email: z.string().email("email is invalid")
  })
  .strict({
    message: "Some fields are not allowed"
  });

export type CreateStudentSchema = z.infer<typeof createStudentSchema>;
