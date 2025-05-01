import { SignUpController } from "@/controllers/auth";
import { ErrorResponse } from "@/controllers/helpers/http";
import { EmailAlreadyTakenError } from "@/errors";
import { StaffWithoutPassword } from "@/repositories";
import { SignUpSchema } from "@/schemas";
import { SignUpUseCase } from "@/useCases";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("SignUpController", () => {
  class SignUpUseCaseStub {
    async execute(params: SignUpSchema): Promise<StaffWithoutPassword> {
      return {
        id: faker.string.uuid(),
        name: params.name,
        email: params.email,
        role: params.role
      };
    }
  }

  function makeSut() {
    const signUpUseCase = new SignUpUseCaseStub() as SignUpUseCase;
    const sut = new SignUpController(signUpUseCase);
    return { sut, signUpUseCase };
  }

  type HttpRequest = Request<any, any, SignUpSchema>;

  const httpRequest = {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8
      }),
      role: "REGISTRAR"
    }
  } as HttpRequest;

  it("should return 201 alongside staff created", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual<StaffWithoutPassword>({
      id: expect.any(String),
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      role: httpRequest.body.role
    });
  });

  it("should call use case with correct param", async () => {
    const { sut, signUpUseCase } = makeSut();
    const spy = vi.spyOn(signUpUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.body);
  });

  it.each([
    {
      scenario: "name is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          name: 1
        }
      },
      errorMessage: /name must be a string/i
    },
    {
      scenario: "name is invalid",
      httpRequest: {
        body: {
          ...httpRequest.body,
          name: ""
        }
      },
      errorMessage: /name is required/i
    },
    {
      scenario: "email is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          email: 1
        }
      },
      errorMessage: /email must be a string/i
    },
    {
      scenario: "email is invalid",
      httpRequest: {
        body: {
          ...httpRequest.body,
          email: "invalid-email"
        }
      },
      errorMessage: /invalid email/i
    },
    {
      scenario: "password is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          password: 1
        }
      },
      errorMessage: /password must be a string/i
    },
    {
      scenario: "password is less than 8 characters",
      httpRequest: {
        body: {
          ...httpRequest.body,
          password: "1234567"
        }
      },
      errorMessage: /at least 8 characters/i
    },
    {
      scenario: "role is invalid",
      httpRequest: {
        body: {
          ...httpRequest.body,
          role: "ADMIN"
        }
      },
      errorMessage: /must be either REGISTRAR OR PROFESSOR/i
    },
    {
      scenario: "a not allowed field is provided",
      httpRequest: {
        body: {
          ...httpRequest.body,
          extra: 1
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

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(errorMessage);
      expect(response.body.code).toBe("INVALID_REQUEST");
    }
  );

  it("should return 409 when use case throws EmailAlreadyTakenError", async () => {
    const { sut, signUpUseCase } = makeSut();
    vi.spyOn(signUpUseCase, "execute").mockRejectedValueOnce(
      new EmailAlreadyTakenError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/already been taken/i);
    expect(response.body.code).toBe("EMAIL_ALREADY_TAKEN");
  });

  it("should return 500 when use case throws an unknown error", async () => {
    const { sut, signUpUseCase } = makeSut();
    vi.spyOn(signUpUseCase, "execute").mockRejectedValueOnce(new Error());

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/server error/i);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
