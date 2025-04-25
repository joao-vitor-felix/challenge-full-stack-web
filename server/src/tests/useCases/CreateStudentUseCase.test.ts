import { Student } from "@/types/Student";
import { CreateStudentUseCase } from "@/useCases/CreateStudentUseCase";
import { faker } from "@faker-js/faker";
import { StudentRepositoryStub } from "../stubs/StudentRepositoryStub";

describe("CreateStudentUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const sut = new CreateStudentUseCase(studentRepository);
    return {
      studentRepository,
      sut
    };
  }

  const student: Student = {
    ra: faker.string.numeric(11),
    cpf: faker.string.numeric(11),
    name: faker.person.fullName(),
    email: faker.internet.email()
  };

  it("should create a student with valid data", async () => {
    const { sut } = makeSut();

    const studentCreated = await sut.execute(student);

    expect(studentCreated).toEqual(student);
  });

  it.todo("should call student repository with correct params", async () => {});

  it.todo(
    "should throws if a student with provided data is found",
    async () => {}
  );

  it.todo("should throw if student repository throws", async () => {});
});
