import { SignUpSchema } from "@/schemas/auth/signUpSchema";
import { Staff } from "@/types/Staff";

export interface IStaffRepository {
  create(params: SignUpSchema): Promise<Staff>;
  getByEmail(email: string): Promise<Staff | null>;
}
