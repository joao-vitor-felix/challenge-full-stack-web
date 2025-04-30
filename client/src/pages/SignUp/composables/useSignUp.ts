import type { SignUpSchema } from "@/pages/SignUp/schemas/signUpSchema";
import { AuthService } from "@/services/AuthService";
import type { Error } from "@/types/Error";
import type { Staff } from "@/types/Staff";
import { useMutation } from "@tanstack/vue-query";
import type { AxiosError } from "axios";

export type SignUpDTO = Omit<SignUpSchema, "confirmPassword">;

export function useSignUp() {
  const mutation = useMutation<Staff, AxiosError<Error>, SignUpDTO>({
    mutationFn: params => AuthService.signUp(params)
  });

  return mutation;
}
