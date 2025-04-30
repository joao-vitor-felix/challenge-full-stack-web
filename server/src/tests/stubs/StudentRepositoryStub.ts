import {
  DataAvailabilityParams,
  IStudentRepository,
  ListStudentsOutput
} from "@/repositories/interfaces/IStudentRepository";
import { UpdateStudentSchema } from "@/schemas";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";
import { faker } from "@faker-js/faker";

export class StudentRepositoryStub implements IStudentRepository {
  async findByEmail(email: string): Promise<Student | null> {
    return Promise.resolve<Student>({
      ra: faker.string.numeric(11),
      cpf: faker.string.numeric(11),
      name: faker.person.fullName(),
      email
    });
  }

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

  async update(
    ra: string,
    params: UpdateStudentSchema
  ): Promise<Student | null> {
    return Promise.resolve({
      ra,
      cpf: faker.string.numeric(11),
      name: params.name ?? faker.person.fullName(),
      email: params.email ?? faker.internet.email()
    });
  }

  async list(
    page: number,
    pageSize: number,
    _name = ""
  ): Promise<ListStudentsOutput> {
    return Promise.resolve({
      data: [
        {
          ra: faker.string.numeric(11),
          cpf: faker.string.numeric(11),
          name: faker.person.fullName(),
          email: faker.internet.email()
        }
      ],
      pagination: {
        total: 1,
        totalPages: 1,
        pageSize,
        currentPage: page
      }
    });
  }

  async delete(_ra: string): Promise<void | null> {
    return Promise.resolve();
  }
}
