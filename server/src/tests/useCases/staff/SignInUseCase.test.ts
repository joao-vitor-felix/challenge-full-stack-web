import { JwtTokenAdapterStub } from "@/tests/stubs/JwtTokenAdapterStub";
import { PasswordHasherAdapterStub } from "@/tests/stubs/PasswordHasherStub";
import { StaffRepositoryStub } from "@/tests/stubs/StaffRepositoryStub";
import { SignInUseCase } from "@/useCases/auth/SignInUseCase";
import { faker } from "@faker-js/faker";

describe("SignUpUseCase", () => {
  function makeSut() {
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const jwtTokenAdapter = new JwtTokenAdapterStub();
    const staffRepository = new StaffRepositoryStub();
    const sut = new SignInUseCase(
      passwordHasherAdapter,
      jwtTokenAdapter,
      staffRepository
    );

    return {
      passwordHasherAdapter,
      jwtTokenAdapter,
      staffRepository,
      sut
    };
  }

  const params = {
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 8
    })
  };

  it("should return tokens successfully", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "getByEmail").mockResolvedValue({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: params.email,
      hashedPassword: "hashedPassword",
      role: "REGISTRAR"
    });

    const result = await sut.execute(params.email, params.password);

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    });
  });

  it.todo("should", async () => {});

  it.todo("should", async () => {});

  it.todo("should", async () => {});

  it.todo("should", async () => {});
});
