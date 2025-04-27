import { IStaffRepository } from "@/repositories";
import { CreateStaffSchema } from "@/schemas";
import { Staff } from "@/types/Staff";
import { faker } from "@faker-js/faker";

export class StaffRepositoryStub implements IStaffRepository {
  async create(params: CreateStaffSchema): Promise<Staff> {
    return Promise.resolve({
      id: faker.string.uuid(),
      name: params.name,
      email: params.email,
      hashedPassword: params.password,
      role: params.role
    });
  }

  async getByEmail(_email: string): Promise<Staff | null> {
    return Promise.resolve(null);
  }
}
