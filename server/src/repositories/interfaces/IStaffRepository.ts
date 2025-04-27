import { CreateStaffSchema } from "@/schemas/staff/createStaffSchema";
import { Staff } from "@/types/Staff";

export interface IStaffRepository {
  create(params: CreateStaffSchema): Promise<Staff>;
  getByEmail(email: string): Promise<Staff | null>;
}
