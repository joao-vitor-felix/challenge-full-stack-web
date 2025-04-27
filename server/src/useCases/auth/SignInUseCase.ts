import { IPasswordHasher } from "@/adapters";
import { IJwtToken } from "@/adapters/interfaces/IJwtToken";
import { PasswordMismatchError, StaffNotFoundError } from "@/errors/staff";
import { env } from "@/helpers/env";
import { IStaffRepository } from "@/repositories";
import { SignOptions } from "jsonwebtoken";

export class SignInUseCase {
  constructor(
    private passwordHasher: IPasswordHasher,
    private jwtTokenAdapter: IJwtToken,
    private staffRepository: IStaffRepository
  ) {}

  async execute(email: string, password: string) {
    const staff = await this.staffRepository.getByEmail(email);

    if (!staff) {
      throw new StaffNotFoundError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      staff.hashedPassword
    );

    if (!isPasswordValid) {
      throw new PasswordMismatchError();
    }

    const accessToken = this.jwtTokenAdapter.sign<SignOptions>(
      {
        role: staff.role
      },
      env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
        subject: staff.id
      }
    );

    const refreshToken = this.jwtTokenAdapter.sign<SignOptions>(
      {},
      env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "7d",
        subject: staff.id
      }
    );

    return {
      accessToken,
      refreshToken
    };
  }
}
