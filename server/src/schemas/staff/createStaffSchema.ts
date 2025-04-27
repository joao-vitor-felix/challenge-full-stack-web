import { z } from "zod";

export const createStaffSchema = z
  .object({
    name: z
      .string({
        message: "name must be a string"
      })
      .min(1, "name is required"),
    email: z
      .string({
        message: "email must be a string"
      })
      .email({
        message: "invalid email"
      }),
    password: z
      .string({
        message: "password must be a string"
      })
      .min(8, "password must have at least 8 characters"),
    role: z.enum(["REGISTRAR", "PROFESSOR"], {
      errorMap: () => ({ message: "role must be either 'admin' or 'user'" })
    })
  })
  .strict({
    message: "Some fields are not allowed"
  });

export type CreateStaffSchema = z.infer<typeof createStaffSchema>;
