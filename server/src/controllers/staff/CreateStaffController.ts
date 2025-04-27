import { EmailAlreadyTakenError } from "@/errors";
import { createStaffSchema } from "@/schemas";
import { CreateStaffUseCase } from "@/useCases";
import type { Request } from "express";
import { ZodError } from "zod";
import {
  conflict,
  created,
  internalServerError,
  invalidRequest
} from "../helpers/http";

export class CreateStaffController {
  constructor(private createStaffUseCase: CreateStaffUseCase) {}

  async execute(request: Request) {
    try {
      const params = createStaffSchema.parse(request.body);
      const staff = await this.createStaffUseCase.execute(params);
      return created(staff);
    } catch (error) {
      if (error instanceof ZodError) {
        return invalidRequest(error.errors[0].message);
      }

      if (error instanceof EmailAlreadyTakenError) {
        return conflict(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
