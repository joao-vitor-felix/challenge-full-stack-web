import { EmailAlreadyTakenError, StudentNotFoundError } from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";
import { UpdateStudentSchema } from "@/schemas";

export class UpdateStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(ra: string, params: UpdateStudentSchema) {
    if (params.email) {
      const student = await this.studentRepository.findByEmail(params.email);

      if (student) {
        throw new EmailAlreadyTakenError();
      }
    }

    const student = await this.studentRepository.update(ra, params);

    if (!student) {
      throw new StudentNotFoundError();
    }

    return student;
  }
}
