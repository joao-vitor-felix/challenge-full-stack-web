import {
  IStudentRepository,
  ListStudentsOutput
} from "@/repositories/interfaces/IStudentRepository";
import { ListStudentsSchema } from "@/schemas/student/listStudentsSchema";

export class ListStudentsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(params: ListStudentsSchema): Promise<ListStudentsOutput> {
    const result = await this.studentRepository.list(
      params.page,
      params.pageSize,
      params.name
    );
    return result;
  }
}
