import { ICache } from "@/adapters/interfaces/ICache";
import {
  IStudentRepository,
  ListStudentsOutput
} from "@/repositories/interfaces/IStudentRepository";
import { ListStudentsSchema } from "@/schemas/student/listStudentsSchema";

export class ListStudentsUseCase {
  constructor(
    private cache: ICache,
    private studentRepository: IStudentRepository
  ) {}

  async execute(params: ListStudentsSchema): Promise<ListStudentsOutput> {
    let cacheKey = `students:page:${params.page}:size:${params.pageSize}`;

    if (params.name) {
      cacheKey += `:name:${params.name}`;
    }

    const cachedStudents = this.cache.get<ListStudentsOutput>(cacheKey);

    if (cachedStudents) {
      console.info(`Cache hit for key: ${cacheKey}`);
      return cachedStudents;
    }

    const result = await this.studentRepository.list(
      params.page,
      params.pageSize,
      params.name
    );

    if (result.data.length > 0) {
      this.cache.set(cacheKey, result);
      console.info(`Cache set for key: ${cacheKey}`);
    }

    return result;
  }
}
