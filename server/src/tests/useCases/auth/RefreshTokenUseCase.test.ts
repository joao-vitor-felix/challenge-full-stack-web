import { StaffNotFoundError } from "@/errors/staff";
import { JwtTokenAdapterStub } from "@/tests/stubs/JwtTokenAdapterStub";
import { StaffRepositoryStub } from "@/tests/stubs/StaffRepositoryStub";
import { RefreshTokenUseCase } from "@/useCases/auth/RefreshTokenUseCase";

describe("RefreshTokenUseCase", () => {
  function makeSut() {
    const jwtTokenAdapter = new JwtTokenAdapterStub();
    const staffRepository = new StaffRepositoryStub();
    const sut = new RefreshTokenUseCase(jwtTokenAdapter, staffRepository);

    return {
      jwtTokenAdapter,
      staffRepository,
      sut
    };
  }

  it("should return tokens successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute("valid_token");

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    });
  });

  it("should call verify with correct params", async () => {
    const { sut, jwtTokenAdapter } = makeSut();
    const spy = vi.spyOn(jwtTokenAdapter, "verify");

    await sut.execute("valid_token");

    const verifyTokenParameter = spy.mock.calls[0][0];

    expect(spy).toHaveBeenCalledOnce();
    expect(verifyTokenParameter).toBe("valid_token");
  });

  it("should call getById with correct params", async () => {
    const { sut, staffRepository } = makeSut();
    const spy = vi.spyOn(staffRepository, "getById");

    await sut.execute("valid_token");

    expect(spy).toHaveBeenCalledExactlyOnceWith("stubbedId");
  });

  it("should throw StaffNotFoundError when staff is not found", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "getById").mockResolvedValueOnce(null);

    await expect(sut.execute("valid_token")).rejects.toBeInstanceOf(
      StaffNotFoundError
    );
  });

  it("should throw if verify throws", async () => {
    const { sut, jwtTokenAdapter } = makeSut();
    vi.spyOn(jwtTokenAdapter, "verify").mockImplementationOnce(() => {
      throw new Error("any_error");
    });

    await expect(sut.execute("valid_token")).rejects.toThrow();
  });
});
