import { z } from "zod";
import { createStudentSchema } from "./createStudentSchema";

export const deleteStudentSchema = createStudentSchema.pick({
  ra: true
});

export type DeleteStudentSchema = z.infer<typeof deleteStudentSchema>;
