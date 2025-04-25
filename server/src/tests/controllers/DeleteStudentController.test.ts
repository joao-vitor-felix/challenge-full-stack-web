import { DeleteStudentController } from "@/controllers/student";
import { DeleteStudentSchema } from "@/schemas/student";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";
import { faker } from "@faker-js/faker";
import { type Request } from "express";

describe("DeleteStudentController", () => {
  class DeleteStudentUseCaseStub {
    async execute(_ra: string) {
      return;
    }
  }

  function makeSut() {
    const deleteStudentUseCase =
      new DeleteStudentUseCaseStub() as DeleteStudentUseCase;
    const sut = new DeleteStudentController(deleteStudentUseCase);
    return { sut, deleteStudentUseCase };
  }

  type HttpRequest = Request<DeleteStudentSchema>;

  const httpRequest = {
    params: {
      ra: faker.string.numeric(11)
    }
  } as HttpRequest;

  it("should return 200 when delete student successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeUndefined();
  });

  it("should call use case with correct ra", async () => {
    const { sut, deleteStudentUseCase } = makeSut();
    const spy = vi.spyOn(deleteStudentUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.params.ra);
  });

  it.todo.each([{}])("should return 400 when $scenario", async () => {});
  it.todo("should return 404 when student is not found", async () => {});
  it.todo(
    "should return 500 when use case throws an unknown error",
    async () => {}
  );
});
