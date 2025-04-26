import {
  IStudentRepository,
  ListStudentsOutput
} from "@/repositories/interfaces/IStudentRepository";

export class ListStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(
    pageSize: number,
    pageNumber: number,
    name?: string
  ): Promise<ListStudentsOutput> {
    const result = await this.studentRepository.list(
      pageSize,
      pageNumber,
      name
    );
    return result;
  }
}
