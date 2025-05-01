import { StudentNotFoundError } from "@/errors/student";
import { CacheAdapterStub } from "@/tests/stubs/CacheAdapterStub";
import { StudentRepositoryStub } from "@/tests/stubs/StudentRepositoryStub";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";
import { faker } from "@faker-js/faker";

describe("DeleteStudentUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const cacheAdapter = new CacheAdapterStub();
    const sut = new DeleteStudentUseCase(cacheAdapter, studentRepository);
    return {
      studentRepository,
      cacheAdapter,
      sut
    };
  }

  const ra = faker.string.numeric(11);

  it("should delete student successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(ra);

    expect(result).toBeUndefined();
  });

  it("should call delete with correct ra", async () => {
    const { sut, studentRepository } = makeSut();
    const spy = vi.spyOn(studentRepository, "delete");

    await sut.execute(ra);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(ra);
  });

  it("should call delete cache keys when a student is deleted", async () => {
    const { sut, cacheAdapter } = makeSut();
    const keys = ["students:page:1", "students:page:2", "students:page:3"];
    vi.spyOn(cacheAdapter, "keys").mockReturnValue(keys);
    const deleteSpy = vi.spyOn(cacheAdapter, "delete");

    await sut.execute(ra);

    expect(deleteSpy).toHaveBeenCalledExactlyOnceWith(keys);
  });

  it("should throw StudentNotFoundError when student is not found", async () => {
    const { sut, studentRepository } = makeSut();

    vi.spyOn(studentRepository, "delete").mockResolvedValueOnce(null);

    await expect(() => sut.execute(ra)).rejects.toBeInstanceOf(
      StudentNotFoundError
    );
  });

  it("should throw when repository throws", async () => {
    const { sut, studentRepository } = makeSut();

    vi.spyOn(studentRepository, "delete").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(ra)).rejects.toThrow();
  });
});
