import {
  CpfAlreadyTakenError,
  EmailAlreadyTakenError,
  RaAlreadyTakenError
} from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";

export class CreateStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(params: CreateStudentSchema): Promise<Student> {
    const students =
      await this.studentRepository.findStudentsWithMatchingData(params);

    for (const { ra, cpf, email } of students) {
      if (ra === params.ra) {
        throw new RaAlreadyTakenError();
      }

      if (cpf === params.cpf) {
        throw new CpfAlreadyTakenError();
      }

      if (email === params.email) {
        throw new EmailAlreadyTakenError();
      }
    }

    const student = await this.studentRepository.createStudent(params);
    return student;
  }
}
