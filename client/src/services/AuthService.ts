import { api } from "@/lib/api";
import type { SignInSchema } from "@/pages/SignIn/schemas/signInSchema";
import type { SignUpDTO } from "@/pages/SignUp/composables/useSignUp";
import type { Staff } from "@/types/Staff";

export class AuthService {
  static async signUp(params: SignUpDTO) {
    const { data } = await api.post<Staff>("/auth/sign-up", params);
    return data;
  }

  static async signIn(params: SignInSchema) {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>(
      "/auth/sign-in",
      params
    );
    return data;
  }

  static async refreshToken(token: string) {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>(
      "/auth/refresh-token",
      {
        token
      }
    );
    return data;
  }
}
