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

  it("should call findStudentsWithMatchingData with correct params", async () => {
    const { sut, studentRepository } = makeSut();
    const spy = vi.spyOn(studentRepository, "findStudentsWithMatchingData");

    await sut.execute(student);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      ra: student.ra,
      cpf: student.cpf,
      email: student.email
    });
  });

  it.todo(
    "should throws if a student with provided data is found",
    async () => {}
  );

  it.todo("should throw if student repository throws", async () => {});
});
