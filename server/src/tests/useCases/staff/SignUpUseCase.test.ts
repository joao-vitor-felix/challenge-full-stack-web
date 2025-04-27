import { EmailAlreadyTakenError } from "@/errors";
import { SignUpSchema } from "@/schemas";
import { StaffRepositoryStub } from "@/tests/stubs/StaffRepositoryStub";
import { SignUpUseCase } from "@/useCases";
import { faker } from "@faker-js/faker";

describe("SignUpUseCase", () => {
  class PasswordHasherStub {
    async hash(_password: string): Promise<string> {
      return Promise.resolve("hashedPassword");
    }

    async compare(
      _password: string,
      _hashedPassword: string
    ): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  function makeSut() {
    const staffRepository = new StaffRepositoryStub();
    const passwordHasher = new PasswordHasherStub();
    const sut = new SignUpUseCase(passwordHasher, staffRepository);

    return {
      staffRepository,
      passwordHasher,
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
    const { sut, passwordHasher } = makeSut();
    const hashSpy = vi.spyOn(passwordHasher, "hash");

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

  it("should throw when passwordHasher throws", async () => {
    const { sut, passwordHasher } = makeSut();
    vi.spyOn(passwordHasher, "hash").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(staff)).rejects.toThrow();
  });

  it("should throw when repository throws", async () => {
    const { sut, staffRepository } = makeSut();
    vi.spyOn(staffRepository, "create").mockRejectedValueOnce(new Error());

    await expect(() => sut.execute(staff)).rejects.toThrow();
  });
});
