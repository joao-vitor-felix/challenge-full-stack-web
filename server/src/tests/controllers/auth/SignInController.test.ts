import { SignInController } from "@/controllers/auth";
import { ErrorResponse } from "@/controllers/helpers/http";
import { PasswordMismatchError, StaffNotFoundError } from "@/errors/staff";
import { SignInUseCase } from "@/useCases/auth/SignInUseCase";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("SignInController", () => {
  const tokens = {
    accessToken: "access",
    refreshToken: "refresh"
  };
  class SignInUseCaseStub {
    async execute(_email: string, _password: string) {
      return tokens;
    }
  }

  function makeSut() {
    const signInUseCase = new SignInUseCaseStub() as SignInUseCase;
    const sut = new SignInController(signInUseCase);
    return { sut, signInUseCase };
  }

  type HttpRequest = Request<any, any, { email: string; password: string }>;

  const httpRequest = {
    body: {
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8
      })
    }
  } as HttpRequest;

  it("should return 200 alongside tokens", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(tokens);
  });

  it("should call use case with correct params", async () => {
    const { sut, signInUseCase } = makeSut();
    const spy = vi.spyOn(signInUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledExactlyOnceWith(
      httpRequest.body.email,
      httpRequest.body.password
    );
  });

  it.each([
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

  it("should return 404 when use case throws StaffNotFoundError", async () => {
    const { sut, signInUseCase } = makeSut();
    vi.spyOn(signInUseCase, "execute").mockRejectedValueOnce(
      new StaffNotFoundError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
    expect(response.body.code).toBe("STAFF_NOT_FOUND");
  });

  it("should return 400 when use case throws PasswordMismatchError", async () => {
    const { sut, signInUseCase } = makeSut();
    vi.spyOn(signInUseCase, "execute").mockRejectedValueOnce(
      new PasswordMismatchError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/wrong password/i);
    expect(response.body.code).toBe("PASSWORD_MISMATCH");
  });

  it("should return 500 when use case throws an unknown error", async () => {
    const { sut, signInUseCase } = makeSut();
    vi.spyOn(signInUseCase, "execute").mockRejectedValueOnce(
      new Error("Unknown error")
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/internal server error/i);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
