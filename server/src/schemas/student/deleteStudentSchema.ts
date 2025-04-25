import { createStudentSchema } from "./createStudentSchema";

export const deleteStudentSchema = createStudentSchema.pick({
  ra: true
});
