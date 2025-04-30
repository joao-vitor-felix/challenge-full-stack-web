import { SignUpSchema } from "@/schemas/auth/signUpSchema";
import { Staff } from "@/types/Staff";

export interface IStaffRepository {
  create(params: SignUpSchema): Promise<StaffWithoutPassword>;
  getByEmail(email: string): Promise<Staff | null>;
  getById(id: string): Promise<Staff | null>;
}

export type StaffWithoutPassword = Omit<Staff, "hashedPassword">;
