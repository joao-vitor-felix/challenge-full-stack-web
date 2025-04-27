import { EmailAlreadyTakenError } from "@/errors";
import { signUpSchema } from "@/schemas";
import { SignUpUseCase } from "@/useCases";
import type { Request } from "express";
import { ZodError } from "zod";
import {
  badRequest,
  conflict,
  created,
  internalServerError
} from "../helpers/http";

export class SignUpController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  async execute(request: Request) {
    try {
      const params = signUpSchema.parse(request.body);
      const staff = await this.signUpUseCase.execute(params);
      return created(staff);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof EmailAlreadyTakenError) {
        return conflict(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
