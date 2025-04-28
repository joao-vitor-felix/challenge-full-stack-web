import { api } from "@/lib/api";
import type { SignUpDTO } from "@/pages/SignUp/composables/useSignUp";
import type { Staff } from "@/types/Staff";

export class AuthService {
  static async signUp(params: SignUpDTO) {
    const { data } = await api.post<Staff>("/auth/sign-up", params);
    return data;
  }
}
