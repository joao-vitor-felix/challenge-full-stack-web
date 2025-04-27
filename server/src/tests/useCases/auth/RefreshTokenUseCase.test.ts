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

  it.todo(
    "should throw StaffNotFoundError when staff is not found",
    async () => {}
  );
});
