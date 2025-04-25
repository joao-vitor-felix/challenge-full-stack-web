import { StudentNotFoundError } from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";

export class DeleteStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(ra: string): Promise<void> {
    const result = await this.studentRepository.delete(ra);

    if (result === null) {
      throw new StudentNotFoundError();
    }
  }
}
