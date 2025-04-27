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

  it.todo.each([])("should return 400 when $scenario", async () => {});

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
    expect(response.body.code).toBe("INVALID_REQUEST");
  });

  it.todo(
    "should return 500 when use case throws an unknown erro",
    async () => {}
  );
});
