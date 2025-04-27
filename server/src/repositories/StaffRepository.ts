import { IDatabaseConnection } from "@/adapters";
import { SignUpSchema } from "@/schemas/auth/signUpSchema";
import { Staff } from "@/types/Staff";
import { IStaffRepository } from "./interfaces/IStaffRepository";

export class StaffRepository implements IStaffRepository {
  constructor(private db: IDatabaseConnection) {}

  async create(params: SignUpSchema): Promise<Staff> {
    const [staff] = await this.db.query<Staff>(
      `insert into staff (name, email, hashed_password, role)
      values ($1, $2, $3, $4)
      returning id, name, email, hashed_password as "hashedPassword", role`,
      [params.name, params.email, params.password, params.role]
    );

    return staff;
  }

  async getByEmail(email: string): Promise<Staff | null> {
    const [staff] = await this.db.query<Staff>(
      `select id, name, email, hashed_password as "hashedPassword", role
      from staff
      where email = $1`,
      [email]
    );

    return staff ?? null;
  }
}
