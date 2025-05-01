import { ListStudentsSchema } from "@/schemas";
import { CacheAdapterStub } from "@/tests/stubs/CacheAdapterStub";
import { StudentRepositoryStub } from "@/tests/stubs/StudentRepositoryStub";
import { Student } from "@/types/Student";
import { ListStudentsUseCase } from "@/useCases";

describe("ListStudentsUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const cacheAdapter = new CacheAdapterStub();
    const sut = new ListStudentsUseCase(cacheAdapter, studentRepository);
    return {
      sut,
      studentRepository,
      cacheAdapter
    };
  }

  const params: ListStudentsSchema = {
    page: 1,
    pageSize: 10,
    name: "John"
  };

  it("should return students alongside pagination", async () => {
    const { sut, cacheAdapter } = makeSut();
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);

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

  it("should call list with correct params", async () => {
    const { sut, studentRepository, cacheAdapter } = makeSut();
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);

    const spy = vi.spyOn(studentRepository, "list");

    await sut.execute(params);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(params.page, params.pageSize, params.name);
  });

  it("should throw when repository throws", async () => {
    const { sut, studentRepository, cacheAdapter } = makeSut();
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);

    vi.spyOn(studentRepository, "list").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(params)).rejects.toThrow();
  });
});
