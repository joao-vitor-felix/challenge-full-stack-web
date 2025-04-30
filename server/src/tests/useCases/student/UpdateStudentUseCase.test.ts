import { EmailAlreadyTakenError, StudentNotFoundError } from "@/errors/student";
import { UpdateStudentSchema } from "@/schemas";
import { StudentRepositoryStub } from "@/tests/stubs/StudentRepositoryStub";
import { Student } from "@/types/Student";
import { UpdateStudentUseCase } from "@/useCases/student/UpdateStudentUseCase";
import { faker } from "@faker-js/faker";

describe("UpdateStudentUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const sut = new UpdateStudentUseCase(studentRepository);
    return {
      studentRepository,
      sut
    };
  }

  const ra = faker.string.numeric(11);
  const params: UpdateStudentSchema = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  };

  it("should return updated user successfully", async () => {
    const { sut, studentRepository } = makeSut();
    vi.spyOn(studentRepository, "findByEmail").mockResolvedValueOnce(null);

    const student = await sut.execute(ra, params);

    expect(student).toEqual<Student>({
      ra,
      cpf: expect.any(String),
      name: params.name ?? expect.any(String),
      email: params.email ?? expect.any(String)
    });
  });

  it("should call update with correct params", async () => {
    const { sut, studentRepository } = makeSut();
    vi.spyOn(studentRepository, "findByEmail").mockResolvedValueOnce(null);
    const spy = vi.spyOn(studentRepository, "update");

    await sut.execute(ra, params);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(ra, params);
  });

  it("should throw EmailAlreadyTakenError if student with provided email is found", async () => {
    const { sut } = makeSut();

    await expect(sut.execute(ra, params)).rejects.toBeInstanceOf(
      EmailAlreadyTakenError
    );
  });

  it("should throw StudentNotFoundError if no student is returned from update", async () => {
    const { sut, studentRepository } = makeSut();
    vi.spyOn(studentRepository, "findByEmail").mockResolvedValueOnce(null);
    vi.spyOn(studentRepository, "update").mockResolvedValueOnce(null);

    await expect(sut.execute(ra, params)).rejects.toBeInstanceOf(
      StudentNotFoundError
    );
  });

  it("should throw if student repository throws", async () => {
    const { sut, studentRepository } = makeSut();
    vi.spyOn(studentRepository, "update").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(ra, params)).rejects.toThrow();
  });
});
