import { StudentRepositoryStub } from "@/tests/stubs/StudentRepositoryStub";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";
import { faker } from "@faker-js/faker";

describe("DeleteStudentUseCase", () => {
  function makeSut() {
    const studentRepository = new StudentRepositoryStub();
    const sut = new DeleteStudentUseCase(studentRepository);
    return {
      studentRepository,
      sut
    };
  }

  it("should delete student successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.numeric(11));

    expect(result).toBeUndefined();
  });
  it.todo("should call findByRa with correct ra", async () => {});
  it.todo("should call delete with correct ra", async () => {});
  it.todo(
    "should throw StudentNotFoundError when student is not found",
    async () => {}
  );
});
