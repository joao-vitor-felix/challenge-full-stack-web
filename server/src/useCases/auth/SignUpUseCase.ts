import { IPasswordHasher } from "@/adapters";
import { EmailAlreadyTakenError } from "@/errors";
import { IStaffRepository } from "@/repositories";
import { SignUpSchema } from "@/schemas";

export class SignUpUseCase {
  constructor(
    private passwordHasher: IPasswordHasher,
    private staffRepository: IStaffRepository
  ) {}

  async execute(params: SignUpSchema) {
    const staffWithProvidedEmail = await this.staffRepository.getByEmail(
      params.email
    );

    if (staffWithProvidedEmail) {
      throw new EmailAlreadyTakenError();
    }

    params.password = await this.passwordHasher.hash(params.password);
    const staff = await this.staffRepository.create(params);

    return staff;
  }
}
