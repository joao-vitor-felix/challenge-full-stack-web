import { RefreshTokenController } from "@/controllers/auth/RefreshTokenController";
import { ErrorResponse } from "@/controllers/helpers/http";
import { RefreshTokenUseCase } from "@/useCases/auth/RefreshTokenUseCase";
import { faker } from "@faker-js/faker";
import type { Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

describe("RefreshTokenController", () => {
  const tokens = {
    accessToken: "access",
    refreshToken: "refresh"
  };

  class RefreshTokenUseCaseStub {
    async execute(_token: string) {
      return tokens;
    }
  }

  function makeSut() {
    const refreshTokenUseCase =
      new RefreshTokenUseCaseStub() as RefreshTokenUseCase;
    const sut = new RefreshTokenController(refreshTokenUseCase);
    return { sut, refreshTokenUseCase };
  }

  type HttpRequest = Request<any, any, { token: string }>;

  const httpRequest = {
    body: {
      token: faker.internet.jwt()
    }
  } as HttpRequest;

  it("should return 200 alongside tokens", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(tokens);
  });

  it("should call use case with correct params", async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    const spy = vi.spyOn(refreshTokenUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledExactlyOnceWith(httpRequest.body.token);
  });

  it("should return 400 when token is not a string", async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        token: 1
      }
    } as Request;

    const response = (await sut.execute(request)) as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/must be a string/i);
    expect(response.body.code).toBe("INVALID_REQUEST");
  });

  it("should return 400 when token is not a jwt", async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        token: "1"
      }
    } as HttpRequest;

    const response = (await sut.execute(request)) as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
    expect(response.body.code).toBe("INVALID_REQUEST");
  });

  it("should return 400 when use case throws TokenExpiredError", async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    vi.spyOn(refreshTokenUseCase, "execute").mockRejectedValueOnce(
      new TokenExpiredError("Token expired", new Date())
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/expired/i);
    expect(response.body.code).toBe("INVALID_REQUEST");
  });

  it("should return 400 when use case throws JsonWebTokenError", async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    vi.spyOn(refreshTokenUseCase, "execute").mockRejectedValueOnce(
      new JsonWebTokenError("Invalid token")
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
    expect(response.body.code).toBe("INVALID_REQUEST");
  });

  it("should return 500 when use case throws an unknown error", async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    vi.spyOn(refreshTokenUseCase, "execute").mockRejectedValueOnce(new Error());

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/internal server error/i);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
