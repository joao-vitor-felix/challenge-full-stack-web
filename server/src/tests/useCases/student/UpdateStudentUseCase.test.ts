import { UpdateStudentSchema } from "@/schemas/student";
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
    const { sut } = makeSut();

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
    const spy = vi.spyOn(studentRepository, "update");

    await sut.execute(ra, params);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(ra, params);
  });

  it.todo(
    "should throw StudentNotFoundError if no student is returned",
    async () => {}
  );

  it.todo("should throw if repository throws", async () => {});
});
