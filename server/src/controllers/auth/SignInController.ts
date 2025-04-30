import { PasswordMismatchError, StaffNotFoundError } from "@/errors/staff";
import { signInSchema } from "@/schemas/auth/signInSchema";
import { SignInUseCase } from "@/useCases/auth/SignInUseCase";
import type { Request } from "express";
import { ZodError } from "zod";
import {
  badRequest,
  internalServerError,
  notFound,
  success
} from "../helpers/http";

export class SignInController {
  constructor(private signInUseCase: SignInUseCase) {}

  async execute(request: Request) {
    try {
      const params = signInSchema.parse(request.body);
      const tokens = await this.signInUseCase.execute(
        params.email,
        params.password
      );
      return success(tokens);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof StaffNotFoundError) {
        return notFound(error.message, error.code);
      }

      if (error instanceof PasswordMismatchError) {
        return badRequest(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
