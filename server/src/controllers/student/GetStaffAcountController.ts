import { StaffNotFoundError } from "@/errors/staff";
import { GetStaffAccountUseCase } from "@/useCases/staff/GetStaffAccountUseCase";
import { type Request } from "express";
import {
  internalServerError,
  notFound,
  success,
  unauthorized
} from "../helpers/http";

export class GetStaffAccountController {
  constructor(private getStaffAccountUseCase: GetStaffAccountUseCase) {}

  async execute(res: Request) {
    try {
      const staff = res.staff;

      if (!staff) {
        return unauthorized();
      }

      const account = await this.getStaffAccountUseCase.execute(staff.id);
      return success(account);
    } catch (error) {
      if (error instanceof StaffNotFoundError) {
        return notFound(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
