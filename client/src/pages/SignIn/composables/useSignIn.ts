import { AuthService } from "@/services/AuthService";
import { useMutation } from "@tanstack/vue-query";
import type { SignInSchema } from "../schemas/signInSchema";

export function useSignIn() {
  const mutation = useMutation<{ accessToken: string; refreshToken: string }, Error, SignInSchema>({
    mutationFn: params => AuthService.signIn(params)
  });

  return mutation;
}
