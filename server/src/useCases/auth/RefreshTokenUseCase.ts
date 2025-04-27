import { IJwtToken } from "@/adapters/interfaces/IJwtToken";
import { StaffNotFoundError } from "@/errors/staff";
import { IStaffRepository } from "@/repositories";
import { SignOptions } from "jsonwebtoken";
import { env } from "process";

export class RefreshTokenUseCase {
  constructor(
    private jwtTokenAdapter: IJwtToken,
    private staffRepository: IStaffRepository
  ) {}

  async execute(token: string) {
    const { sub } = this.jwtTokenAdapter.verify(token, env.JWT_REFRESH_SECRET);
    const staff = await this.staffRepository.getById(sub!);

    if (!staff) {
      throw new StaffNotFoundError();
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
