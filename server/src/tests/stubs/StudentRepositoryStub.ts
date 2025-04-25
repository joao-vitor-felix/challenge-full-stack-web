import {
  DataAvailabilityParams,
  IStudentRepository
} from "@/repositories/interfaces/IStudentRepository";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";

export class StudentRepositoryStub implements IStudentRepository {
  async createStudent(params: CreateStudentSchema): Promise<Student> {
    return Promise.resolve(params);
  }

  async findStudentsWithMatchingData(
    _params: DataAvailabilityParams
  ): Promise<DataAvailabilityParams[]> {
    return Promise.resolve([]);
  }
}
