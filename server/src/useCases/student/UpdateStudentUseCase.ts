import { ICache } from "@/adapters/interfaces/ICache";
import { EmailAlreadyTakenError, StudentNotFoundError } from "@/errors/student";
import { IStudentRepository } from "@/repositories/interfaces/IStudentRepository";
import { UpdateStudentSchema } from "@/schemas";

export class UpdateStudentUseCase {
  constructor(
    private cache: ICache,
    private studentRepository: IStudentRepository
  ) {}

  async execute(ra: string, params: UpdateStudentSchema) {
    if (params.email) {
      const student = await this.studentRepository.findByEmail(params.email);

      if (student && student.ra !== ra) {
        throw new EmailAlreadyTakenError();
      }
    }

    const student = await this.studentRepository.update(ra, params);

    if (!student) {
      throw new StudentNotFoundError();
    }

    const studentKeys = this.cache
      .keys()
      .filter(key => key.startsWith("students:page:"));
    const deletedKeys = this.cache.delete(studentKeys);
    console.log(`${deletedKeys} cache keys deleted`);

    return student;
  }
}
