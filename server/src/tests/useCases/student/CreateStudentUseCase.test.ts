import {
  CpfAlreadyTakenError,
  EmailAlreadyTakenError,
  RaAlreadyTakenError
} from "@/errors/student";
import { CacheAdapterStub } from "@/tests/stubs/CacheAdapterStub";
import { Student } from "@/types/Student";
import { CreateStudentUseCase } from "@/useCases/student/CreateStudentUseCase";
import { faker } from "@faker-js/faker";
import { StudentRepositoryStub } from "../../stubs/StudentRepositoryStub";

describe("CreateStudentUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const cacheAdapter = new CacheAdapterStub();
    const sut = new CreateStudentUseCase(cacheAdapter, studentRepository);
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
    const spy = vi.spyOn(studentRepository, "findStudentWithMatchingData");

    await sut.execute(student);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      ra: student.ra,
      cpf: student.cpf,
      email: student.email
    });
  });

  it("should call create with correct params", async () => {
    const { sut, studentRepository } = makeSut();
    const spy = vi.spyOn(studentRepository, "create");

    await sut.execute(student);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(student);
  });

  it.each([
    {
      scenario: "RA is already taken",
      error: RaAlreadyTakenError,
      existingStudent: {
        ra: student.ra,
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        name: faker.person.fullName()
      }
    },
    {
      scenario: "Cpf is already taken",
      error: CpfAlreadyTakenError,
      existingStudent: {
        ra: faker.string.numeric(11),
        cpf: student.cpf,
        email: faker.internet.email(),
        name: faker.person.fullName()
      }
    },
    {
      scenario: "Email is already taken",
      error: EmailAlreadyTakenError,
      existingStudent: {
        ra: faker.string.numeric(11),
        cpf: faker.string.numeric(11),
        email: student.email,
        name: faker.person.fullName()
      }
    }
  ])("should throw if $scenario", async ({ error, existingStudent }) => {
    const { sut, studentRepository } = makeSut();
    vi.spyOn(
      studentRepository,
      "findStudentWithMatchingData"
    ).mockResolvedValueOnce(existingStudent);

    await expect(sut.execute(student)).rejects.toBeInstanceOf(error);
  });

  it("should throw if student repository throws", async () => {
    const { sut, studentRepository } = makeSut();
    vi.spyOn(studentRepository, "create").mockRejectedValueOnce(new Error());

    const promise = sut.execute(student);

    await expect(promise).rejects.toThrow();
  });
});
