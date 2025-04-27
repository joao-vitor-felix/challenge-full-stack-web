import { EmailAlreadyTakenError } from "@/errors";
import { SignUpSchema } from "@/schemas";
import { PasswordHasherAdapterStub } from "@/tests/stubs/PasswordHasherStub";
import { StaffRepositoryStub } from "@/tests/stubs/StaffRepositoryStub";
import { SignUpUseCase } from "@/useCases";
import { faker } from "@faker-js/faker";

describe("SignUpUseCase", () => {
  function makeSut() {
    const staffRepository = new StaffRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const sut = new SignUpUseCase(passwordHasherAdapter, staffRepository);

    return {
      staffRepository,
      passwordHasherAdapter,
      sut
    };
  }

  const staff: SignUpSchema = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 8
    }),
    role: "REGISTRAR"
  };

  it("should create a staff successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(staff);

    expect(result).toEqual({
      id: expect.any(String),
      name: staff.name,
      email: staff.email,
      hashedPassword: "hashedPassword",
      role: staff.role
    });
  });

  it("should call hash with correct params", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const hashSpy = vi.spyOn(passwordHasherAdapter, "hash");

    await sut.execute(staff);

    expect(hashSpy).toHaveBeenCalledOnce();
    expect(hashSpy).toHaveBeenCalledWith(staff.password);
  });

  it("should call create with correct params", async () => {
    const { sut, staffRepository } = makeSut();
    const createSpy = vi.spyOn(staffRepository, "create");

    await sut.execute(staff);

    expect(createSpy).toHaveBeenCalledOnce();
    expect(createSpy).toHaveBeenCalledWith({
      ...staff,
      password: "hashedPassword"
    });
  });

  it("should return EmailAlreadyTakenError when email is already in use", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "getByEmail").mockResolvedValueOnce({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: staff.email,
      hashedPassword: faker.string.nanoid(),
      role: "REGISTRAR"
    });

    await expect(() => sut.execute(staff)).rejects.toBeInstanceOf(
      EmailAlreadyTakenError
    );
  });

  it("should throw when passwordHasherAdapter throws", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    vi.spyOn(passwordHasherAdapter, "hash").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(staff)).rejects.toThrow();
  });

  it("should throw when repository throws", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "create").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(staff)).rejects.toThrow();
  });
});
