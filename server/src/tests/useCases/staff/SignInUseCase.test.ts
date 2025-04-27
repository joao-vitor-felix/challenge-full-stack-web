import { StaffNotFoundError } from "@/errors/staff";
import { JwtTokenAdapterStub } from "@/tests/stubs/JwtTokenAdapterStub";
import { PasswordHasherAdapterStub } from "@/tests/stubs/PasswordHasherStub";
import { StaffRepositoryStub } from "@/tests/stubs/StaffRepositoryStub";
import { Staff } from "@/types/Staff";
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

  const staff: Staff = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: params.email,
    hashedPassword: "hashedPassword",
    role: "REGISTRAR"
  };

  it("should return tokens successfully", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "getByEmail").mockResolvedValue(staff);

    const result = await sut.execute(params.email, params.password);

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    });
  });

  it("should call getByEmail with correct params", async () => {
    const { sut, staffRepository } = makeSut();
    const spy = vi
      .spyOn(staffRepository, "getByEmail")
      .mockResolvedValue(staff);

    await sut.execute(params.email, params.password);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(params.email);
  });

  it("should call compare with correct params", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const spy = vi.spyOn(passwordHasherAdapter, "compare");

    await sut.execute(params.email, params.password);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(params.password, staff.hashedPassword);
  });

  it("should call sign with correctly", async () => {
    const { sut, jwtTokenAdapter } = makeSut();
    const spy = vi.spyOn(jwtTokenAdapter, "sign");

    await sut.execute(params.email, params.password);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should return StaffNotFoundError if a staff is not found", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "getByEmail").mockResolvedValue(null);

    const promise = sut.execute(params.email, params.password);

    await expect(promise).rejects.toBeInstanceOf(StaffNotFoundError);
  });
  it.todo(
    "should return PasswordMismatchError if password doesn't match",
    async () => {}
  );

  it.todo("should throw if repository throws", async () => {});

  it.todo("should throw if compare throws", async () => {});

  it.todo("should throw if sign throws", async () => {});
});
