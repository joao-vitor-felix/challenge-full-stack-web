import { signUpSchema } from "./signUpSchema";

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true
});
