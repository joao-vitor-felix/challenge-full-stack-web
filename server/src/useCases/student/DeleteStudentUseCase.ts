import { StudentNotFoundError } from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";

export class DeleteStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(ra: string): Promise<void> {
    const student = await this.studentRepository.findByRa(ra);

    if (!student) {
      throw new StudentNotFoundError();
    }

    await this.studentRepository.delete(ra);
  }
}
