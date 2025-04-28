import type { SignUpSchema } from "@/pages/SignUp/schemas/signUpSchema";
import { AuthService } from "@/services/AuthService";
import type { Staff } from "@/types/Staff";
import { useMutation } from "@tanstack/vue-query";

export type SignUpDTO = Omit<SignUpSchema, "confirmPassword">;

export function useSignUp() {
  const mutation = useMutation<Staff, Error, SignUpDTO>({
    mutationFn: params => AuthService.signUp(params)
  });

  return mutation;
}
