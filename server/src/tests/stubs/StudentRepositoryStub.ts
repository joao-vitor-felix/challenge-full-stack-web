import {
  DataAvailabilityParams,
  IStudentRepository
} from "@/repositories/interfaces/IStudentRepository";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";
import { faker } from "@faker-js/faker";

export class StudentRepositoryStub implements IStudentRepository {
  async create(params: CreateStudentSchema): Promise<Student> {
    return Promise.resolve(params);
  }

  async findStudentsWithMatchingData(
    _params: DataAvailabilityParams
  ): Promise<DataAvailabilityParams[]> {
    return Promise.resolve([]);
  }

  async findByRa(ra: string): Promise<Student | null> {
    return Promise.resolve<Student>({
      ra,
      cpf: faker.string.numeric(11),
      name: faker.person.fullName(),
      email: faker.internet.email()
    });
  }

  async delete(_ra: string): Promise<void | null> {
    return Promise.resolve();
  }
}
