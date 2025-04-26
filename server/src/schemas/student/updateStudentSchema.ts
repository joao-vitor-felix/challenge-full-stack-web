import { z } from "zod";
import { createStudentSchema } from "./createStudentSchema";

export const updateStudentSchema = createStudentSchema
  .pick({
    name: true,
    email: true
  })
  .partial();

export const updateStudentParamsSchema = createStudentSchema.pick({
  ra: true
});

export type UpdateStudentSchema = z.infer<typeof updateStudentSchema>;
