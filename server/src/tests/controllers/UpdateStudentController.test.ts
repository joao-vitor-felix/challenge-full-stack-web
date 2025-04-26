import { ErrorResponse } from "@/controllers/helpers/http";
import { UpdateStudentController } from "@/controllers/student/UpdateStudentController";
import { UpdateStudentSchema } from "@/schemas/student";
import { Student } from "@/types/Student";
import { UpdateStudentUseCase } from "@/useCases/student/UpdateStudentUseCase";
import { faker } from "@faker-js/faker";
import { type Request } from "express";

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

  it.todo("should return 400 if ra is not valid", async () => {});

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

  it.todo(
    "should return 404 when use case throws StudentNotFoundError",
    async () => {}
  );

  it.todo(
    "should return 500 when use case throws an unknown error",
    async () => {}
  );
});
