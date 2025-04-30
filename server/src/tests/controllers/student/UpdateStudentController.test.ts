import { ErrorResponse } from "@/controllers/helpers/http";
import { UpdateStudentController } from "@/controllers/student/UpdateStudentController";
import { EmailAlreadyTakenError, StudentNotFoundError } from "@/errors/student";
import { UpdateStudentSchema } from "@/schemas";
import { Student } from "@/types/Student";
import { UpdateStudentUseCase } from "@/useCases/student/UpdateStudentUseCase";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("UpdateStudentController", () => {
  class UpdateStudentUseCaseStub {
    async execute(ra: string, params: UpdateStudentSchema): Promise<Student> {
      return {
        ra,
        cpf: faker.string.numeric(11),
        name: params.name ?? faker.person.fullName(),
        email: params.email ?? faker.internet.email()
      };
    }
  }

  function makeSut() {
    const updateStudentUseCase =
      new UpdateStudentUseCaseStub() as UpdateStudentUseCase;
    const sut = new UpdateStudentController(updateStudentUseCase);
    return { sut, updateStudentUseCase };
  }

  type HttpRequest = Request<
    {
      ra: string;
    },
    any,
    UpdateStudentSchema
  >;

  const httpRequest = {
    params: {
      ra: faker.string.numeric(11)
    },
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email()
    }
  } as HttpRequest;

  it("should return 200 alongside updated student", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual<Student>({
      ra: httpRequest.params.ra,
      cpf: expect.any(String),
      name: httpRequest.body.name ?? expect.any(String),
      email: httpRequest.body.email ?? expect.any(String)
    });
  });

  it("should return 200 alongside updated student with partial params", async () => {
    const { sut } = makeSut();
    const partialRequest = {
      params: {
        ra: faker.string.numeric(11)
      },
      body: {
        name: faker.person.fullName()
      }
    } as HttpRequest;

    const response = await sut.execute(partialRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual<Student>({
      ra: partialRequest.params.ra,
      cpf: expect.any(String),
      name: partialRequest.body.name ?? expect.any(String),
      email: partialRequest.body.email ?? expect.any(String)
    });
  });

  it("should call use case with correct params", async () => {
    const { sut, updateStudentUseCase } = makeSut();
    const spy = vi.spyOn(updateStudentUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.params.ra, httpRequest.body);
  });

  it.each([
    {
      scenario: "ra is not a string",
      httpRequest: {
        params: {
          ra: 1
        },
        body: httpRequest.body
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "ra is less than 11 characters",
      httpRequest: {
        params: {
          ra: faker.string.numeric(10)
        },
        body: httpRequest.body
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "ra is more than 11 characters",
      httpRequest: {
        params: {
          ra: faker.string.numeric(12)
        },
        body: httpRequest.body
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "name is not a string",
      httpRequest: {
        params: httpRequest.params,
        body: {
          ...httpRequest.body,
          name: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "email is not a string",
      httpRequest: {
        params: httpRequest.params,
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
        params: httpRequest.params,
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
        params: httpRequest.params,
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

  it("should return 404 when use case throws StudentNotFoundError", async () => {
    const { sut, updateStudentUseCase } = makeSut();
    vi.spyOn(updateStudentUseCase, "execute").mockRejectedValueOnce(
      new StudentNotFoundError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
    expect(response.body.code).toBe("STUDENT_NOT_FOUND");
  });

  it("should return 409 when use case throws EmailAlreadyTakenError", async () => {
    const { sut, updateStudentUseCase } = makeSut();
    vi.spyOn(updateStudentUseCase, "execute").mockRejectedValueOnce(
      new EmailAlreadyTakenError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/already been taken/i);
    expect(response.body.code).toBe("EMAIL_ALREADY_TAKEN");
  });

  it("should return 500 when use case throws an unknown error", async () => {
    const { sut, updateStudentUseCase } = makeSut();
    vi.spyOn(updateStudentUseCase, "execute").mockRejectedValueOnce(
      new Error()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/server error/i);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
