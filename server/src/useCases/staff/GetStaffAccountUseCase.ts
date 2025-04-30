import { StaffNotFoundError } from "@/errors/staff";
import { IStaffRepository } from "@/repositories";

export class GetStaffAccountUseCase {
  constructor(private staffRepository: IStaffRepository) {}

  async execute(id: string) {
    const staff = await this.staffRepository.getById(id);

    if (!staff) {
      throw new StaffNotFoundError();
    }

    const { hashedPassword, ...staffWithoutPassword } = staff;
    return staffWithoutPassword;
  }
}
