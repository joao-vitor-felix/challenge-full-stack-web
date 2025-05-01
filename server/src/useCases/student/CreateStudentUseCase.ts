import { ICache } from "@/adapters/interfaces/ICache";
import {
  CpfAlreadyTakenError,
  EmailAlreadyTakenError,
  RaAlreadyTakenError
} from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";

export class CreateStudentUseCase {
  constructor(
    private cache: ICache,
    private studentRepository: IStudentRepository
  ) {}

  async execute(params: CreateStudentSchema): Promise<Student> {
    const studentWithMatchingData =
      await this.studentRepository.findStudentWithMatchingData({
        ra: params.ra,
        cpf: params.cpf,
        email: params.email
      });

    if (studentWithMatchingData) {
      if (studentWithMatchingData.ra === params.ra) {
        throw new RaAlreadyTakenError();
      }

      if (studentWithMatchingData.cpf === params.cpf) {
        throw new CpfAlreadyTakenError();
      }

      if (studentWithMatchingData.email === params.email) {
        throw new EmailAlreadyTakenError();
      }
    }

    const student = await this.studentRepository.create(params);
    const studentKeys = this.cache
      .keys()
      .filter(key => key.startsWith("students:page:"));

    const deletedKeys = this.cache.delete(studentKeys);
    console.log(`${deletedKeys} cache keys deleted`);

    return student;
  }
}
