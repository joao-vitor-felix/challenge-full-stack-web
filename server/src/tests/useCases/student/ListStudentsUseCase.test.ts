import { ListStudentsOutput } from "@/repositories";
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
        pageSize: params.pageSize,
        currentPage: params.page
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

  it("should return cached students if found", async () => {
    const { sut, cacheAdapter } = makeSut();

    const cachedStudents: ListStudentsOutput = {
      data: [
        {
          ra: "123456789",
          cpf: "12345678901",
          name: "John Doe",
          email: "johndoe@gmail.com"
        }
      ],
      pagination: {
        total: 1,
        totalPages: 1,
        pageSize: 10,
        currentPage: 1
      }
    };

    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(cachedStudents);

    await expect(sut.execute(params)).resolves.toEqual(cachedStudents);
  });

  it("should persist cache if data length is higher than 0", async () => {
    const students: ListStudentsOutput = {
      data: [
        {
          ra: "123456789",
          cpf: "12345678901",
          name: "John Doe",
          email: "johndoe@gmail.com"
        }
      ],
      pagination: {
        total: 0,
        totalPages: 0,
        pageSize: 10,
        currentPage: 1
      }
    };

    const { sut, cacheAdapter, studentRepository } = makeSut();
    const setSpy = vi.spyOn(cacheAdapter, "set");
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);
    vi.spyOn(studentRepository, "list").mockResolvedValueOnce(students);
    const cacheKey = `students:page:${params.page}:size:${params.pageSize}:name:${params.name}`;

    await sut.execute(params);

    expect(setSpy).toHaveBeenCalledExactlyOnceWith(cacheKey, students);
  });

  it("should persist cache if data length is higher than 0", async () => {
    const students: ListStudentsOutput = {
      data: [
        {
          ra: "123456789",
          cpf: "12345678901",
          name: "John Doe",
          email: "johndoe@gmail.com"
        }
      ],
      pagination: {
        total: 0,
        totalPages: 0,
        pageSize: 10,
        currentPage: 1
      }
    };

    const { sut, cacheAdapter, studentRepository } = makeSut();
    const setSpy = vi.spyOn(cacheAdapter, "set");
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);
    vi.spyOn(studentRepository, "list").mockResolvedValueOnce(students);
    const cacheKey = `students:page:${params.page}:size:${params.pageSize}:name:${params.name}`;

    await sut.execute(params);

    expect(setSpy).toHaveBeenCalledExactlyOnceWith(cacheKey, students);
  });

  it("should not persist cache if data there's no data length", async () => {
    const students: ListStudentsOutput = {
      data: [],
      pagination: {
        total: 0,
        totalPages: 0,
        pageSize: 10,
        currentPage: 1
      }
    };

    const { sut, cacheAdapter, studentRepository } = makeSut();
    const setSpy = vi.spyOn(cacheAdapter, "set");
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);
    vi.spyOn(studentRepository, "list").mockResolvedValueOnce(students);

    await sut.execute(params);

    expect(setSpy).not.toHaveBeenCalled();
  });

  it("should throw when repository throws", async () => {
    const { sut, studentRepository, cacheAdapter } = makeSut();
    vi.spyOn(cacheAdapter, "get").mockReturnValueOnce(undefined);

    vi.spyOn(studentRepository, "list").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(params)).rejects.toThrow();
  });
});
