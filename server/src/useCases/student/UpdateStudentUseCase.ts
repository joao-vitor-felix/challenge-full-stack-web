import { StudentNotFoundError } from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";
import { UpdateStudentSchema } from "@/schemas/student";

export class UpdateStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(ra: string, params: UpdateStudentSchema) {
    const student = await this.studentRepository.update(ra, params);

    if (!student) {
      throw new StudentNotFoundError();
    }

    return student;
  }
}
