import { SignInController } from "@/controllers/auth";
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

  it.todo(
    "should return 404 when use case throws StaffNotFoundError",
    async () => {}
  );

  it.todo(
    "should return 400 when use case throws PasswordMismatchError",
    async () => {}
  );

  it.todo(
    "should return 500 when use case throws an unknown erro",
    async () => {}
  );
});
