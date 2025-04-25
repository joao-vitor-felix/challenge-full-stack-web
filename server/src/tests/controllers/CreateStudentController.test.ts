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

  it.todo("should call use case with correct params", async () => {});

  it.todo.each([])(
    "should return 400 when $scenario",
    async ({ scenario }) => {}
  );

  it.todo(
    "should return 500 when use cases throws an unknown error",
    async () => {}
  );
});
