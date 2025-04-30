import { IStaffRepository, StaffWithoutPassword } from "@/repositories";
import { SignUpSchema } from "@/schemas";
import { Staff } from "@/types/Staff";
import { faker } from "@faker-js/faker";

export class StaffRepositoryStub implements IStaffRepository {
  async create(params: SignUpSchema): Promise<StaffWithoutPassword> {
    return Promise.resolve({
      id: faker.string.uuid(),
      name: params.name,
      email: params.email,
      role: params.role
    });
  }

  async getByEmail(email: string): Promise<Staff | null> {
    return Promise.resolve({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email,
      hashedPassword: "hashedPassword",
      role: "REGISTRAR"
    });
  }

  async getById(id: string): Promise<Staff | null> {
    return Promise.resolve({
      id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      hashedPassword: "hashedPassword",
      role: "REGISTRAR"
    });
  }
}
