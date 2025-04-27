import { ListStudentsSchema } from "@/schemas";
import { StudentRepositoryStub } from "@/tests/stubs/StudentRepositoryStub";
import { Student } from "@/types/Student";
import { ListStudentsUseCase } from "@/useCases";

describe("ListStudentsUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const sut = new ListStudentsUseCase(studentRepository);
    return {
      sut,
      studentRepository
    };
  }

  const params: ListStudentsSchema = {
    page: 1,
    pageSize: 10,
    name: "John"
  };

  it("should return students alongside pagination", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(params);

    expect(result).toEqual({
      data: expect.arrayContaining<Student>([
        {
          ra: expect.any(String),
          cpf: expect.any(String),
          name: expect.any(String),
          email: expect.any(String)
        }
      ]),
      pagination: expect.objectContaining({
        total: expect.any(Number),
        totalPages: expect.any(Number),
        pageSize: expect.any(Number),
        currentPage: expect.any(Number)
      })
    });
  });

  it.todo("should call list with correct params", async () => {});
  it.todo("should throw if repository throws", async () => {});
});
