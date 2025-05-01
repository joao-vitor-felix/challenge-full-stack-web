import { ICache } from "@/adapters/interfaces/ICache";
import { StudentNotFoundError } from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";

export class DeleteStudentUseCase {
  constructor(
    private cache: ICache,
    private studentRepository: IStudentRepository
  ) {}

  async execute(ra: string): Promise<void> {
    const result = await this.studentRepository.delete(ra);

    if (result === null) {
      throw new StudentNotFoundError();
    }

    const studentKeys = this.cache
      .keys()
      .filter(key => key.startsWith("students:page:"));
    const deletedKeys = this.cache.delete(studentKeys);
    console.log(`${deletedKeys} cache keys deleted`);
  }
}
