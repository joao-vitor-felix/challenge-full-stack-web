import { CreateStaffController } from "@/controllers/staff";
import { CreateStaffSchema } from "@/schemas";
import { Staff } from "@/types/Staff";
import { CreateStaffUseCase } from "@/useCases";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("CreateStaffController", () => {
  class CreateStaffUseCaseStub {
    async execute(params: CreateStaffSchema): Promise<Staff> {
      return {
        id: faker.string.uuid(),
        name: params.name,
        email: params.email,
        hashedPassword: faker.string.nanoid(),
        role: params.role
      };
    }
  }

  function makeSut() {
    const createStaffUseCase =
      new CreateStaffUseCaseStub() as CreateStaffUseCase;
    const sut = new CreateStaffController(createStaffUseCase);
    return { sut, createStaffUseCase };
  }

  type HttpRequest = Request<any, any, CreateStaffSchema>;

  const httpRequest = {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "REGISTRAR"
    }
  } as HttpRequest;

  it("should return 201 alongside staff created", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual<Staff>({
      id: expect.any(String),
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      hashedPassword: expect.any(String),
      role: httpRequest.body.role
    });
  });

  it.todo("should call use case with correct param", async () => {});

  it.todo.each([])("should return 400 when $scenario", async () => {});

  it.todo(
    "should return 409 when use case throws EmailAlreadyTakenError",
    async () => {}
  );

  it.todo(
    "should return 500 when use case throws an unknown error",
    async () => {}
  );
});
