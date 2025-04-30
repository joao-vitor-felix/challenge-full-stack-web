import { AuthService } from "@/services/AuthService";
import type { Error } from "@/types/Error";
import { useMutation } from "@tanstack/vue-query";
import type { AxiosError } from "axios";
import type { SignInSchema } from "../schemas/signInSchema";

export function useSignIn() {
  const mutation = useMutation<
    { accessToken: string; refreshToken: string },
    AxiosError<Error>,
    SignInSchema
  >({
    mutationFn: params => AuthService.signIn(params)
  });

  return mutation;
}
