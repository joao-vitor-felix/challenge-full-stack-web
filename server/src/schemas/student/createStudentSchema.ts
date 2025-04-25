import { z } from "zod";

export const createStudentSchema = z
  .object({
    ra: z
      .string({
        message: "ra must be a string"
      })
      .min(11, "ra must contain 11 characters")
      .max(11, "ra must contain 11 characters"),
    cpf: z
      .string({
        message: "cpf must be a string"
      })
      .min(11, "cpf must contain 11 characters")
      .max(11, "cpf must contain 11 characters"),
    name: z
      .string({
        message: "name must be a string"
      })
      .min(1, "name is required"),
    email: z
      .string({
        message: "email must be a string"
      })
      .email("email is invalid")
  })
  .strict({
    message: "Some fields are not allowed"
  });

export type CreateStudentSchema = z.infer<typeof createStudentSchema>;
