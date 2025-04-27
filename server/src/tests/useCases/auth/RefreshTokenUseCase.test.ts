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

  it.todo("should call verify with correct params", async () => {});
  it.todo("should call verify with correct params", async () => {});
  it.todo("should call verify with correct params", async () => {});
  it.todo("should call verify with correct params", async () => {});
  it.todo("should call verify with correct params", async () => {});
  it.todo("should call verify with correct params", async () => {});
});
