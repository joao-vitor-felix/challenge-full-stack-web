import { ErrorResponse } from "@/controllers/helpers/http";
import { CreateStudentController } from "@/controllers/student/CreateStudentController";
import { EmailAlreadyTakenError, RaAlreadyTakenError } from "@/errors";
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

  type HttpRequest = Request<any, any, CreateStudentSchema>;

  const httpRequest = {
    body: {
      ra: faker.string.numeric(11),
      cpf: faker.string.numeric(11),
      name: faker.person.fullName(),
      email: faker.internet.email()
    }
  } as HttpRequest;

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

  it.each([
    {
      scenario: "ra is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          ra: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "ra is less than 11 characters",
      httpRequest: {
        body: {
          ...httpRequest.body,
          ra: faker.string.numeric(10)
        }
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "ra is more than 11 characters",
      httpRequest: {
        body: {
          ...httpRequest.body,
          ra: faker.string.numeric(12)
        }
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "cpf is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          cpf: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "cpf is less than 11 characters",
      httpRequest: {
        body: {
          ...httpRequest.body,
          cpf: faker.string.numeric(10)
        }
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "cpf is more than 11 characters",
      httpRequest: {
        body: {
          ...httpRequest.body,
          cpf: faker.string.numeric(12)
        }
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "name is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          name: 2
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "name is not provided",
      httpRequest: {
        body: {
          ...httpRequest.body,
          name: ""
        }
      },
      errorMessage: /required/i
    },
    {
      scenario: "email is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          email: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "email is not valid",
      httpRequest: {
        body: {
          ...httpRequest.body,
          email: "invalid-email"
        }
      },
      errorMessage: /invalid/i
    },
    {
      scenario: "a not allowed field is provided",
      httpRequest: {
        body: {
          ...httpRequest.body,
          role: "ADMIN"
        }
      },
      errorMessage: /not allowed/i
    }
  ])(
    "should return 400 when $scenario",
    async ({ httpRequest, errorMessage }) => {
      const { sut } = makeSut();

      const response = (await sut.execute(
        httpRequest as HttpRequest
      )) as ErrorResponse;

      expect(response.body.message).toMatch(errorMessage);
      expect(response.body.code).toBe("INVALID_REQUEST");
    }
  );

  it("should return 409 when use cases throws RaAlreadyTakenError", async () => {
    const { sut, createStudentUseCase } = makeSut();
    vi.spyOn(createStudentUseCase, "execute").mockRejectedValueOnce(
      new RaAlreadyTakenError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/already exists/i);
    expect(response.body.code).toBe("RA_ALREADY_TAKEN");
  });

  it("should return 409 when use cases throws EmailAlreadyTakenError", async () => {
    const { sut, createStudentUseCase } = makeSut();
    vi.spyOn(createStudentUseCase, "execute").mockRejectedValueOnce(
      new EmailAlreadyTakenError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/have already been taken/i);
    expect(response.body.code).toBe("EMAIL_ALREADY_TAKEN");
  });

  it("should return 500 when use cases throws an unknown error", async () => {
    const { sut, createStudentUseCase } = makeSut();
    vi.spyOn(createStudentUseCase, "execute").mockRejectedValueOnce(
      new Error()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/server error/i);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
