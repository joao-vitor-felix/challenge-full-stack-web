import { CreateStaffSchema } from "@/schemas";
import { StaffRepositoryStub } from "@/tests/stubs/StaffRepositoryStub";
import { CreateStaffUseCase } from "@/useCases";
import { faker } from "@faker-js/faker";

describe("CreateStaffUseCase", () => {
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
    const sut = new CreateStaffUseCase(passwordHasher, staffRepository);

    return {
      staffRepository,
      passwordHasher,
      sut
    };
  }

  const staff: CreateStaffSchema = {
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

  it.todo("should call create with correct params", async () => {});

  it.todo(
    "should return EmailAlreadyTakenError when email is already in use",
    async () => {}
  );

  it.todo("should throw when repository throws", async () => {});

  it.todo("should throw when passwordHasher throws", async () => {});
});
