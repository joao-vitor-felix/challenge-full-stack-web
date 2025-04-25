import { ErrorResponse } from "@/controllers/helpers/http";
import { CreateStudentController } from "@/controllers/student/CreateStudentController";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { CreateStudentUseCase } from "@/useCases/student/CreateStudentUseCase";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("CreateStudentController", () => {
  class CreateStudentUseCaseStub {
    async execute(params: any) {
      return params;
    }
  }

  function makeSut() {
    const createStudentUseCase =
      new CreateStudentUseCaseStub() as CreateStudentUseCase;
    const sut = new CreateStudentController(createStudentUseCase);
    return { sut, createStudentUseCase };
  }

  const httpRequest = {
    body: {
      ra: faker.string.numeric(11),
      cpf: faker.string.numeric(11),
      name: faker.person.fullName(),
      email: faker.internet.email()
    }
  } as Request<any, any, CreateStudentSchema>;

  it("should return 201 alongside student successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(httpRequest.body);
  });

  it("should call use case with correct params", async () => {
    const { sut, createStudentUseCase } = makeSut();
    const spy = vi.spyOn(createStudentUseCase, "execute");

    await sut.execute(httpRequest);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.body);
  });

  it.todo.each([])(
    "should return 400 when $scenario",
    async ({ scenario }) => {}
  );

  it("should return 500 when use cases throws an unknown error", async () => {
    const { sut, createStudentUseCase } = makeSut();
    vi.spyOn(createStudentUseCase, "execute").mockRejectedValueOnce(
      new Error()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;
    expect(response.statusCode).toBe(500);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
