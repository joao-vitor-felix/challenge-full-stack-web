import { StaffNotFoundError } from "@/errors/staff";
import { refreshTokenSchema } from "@/schemas/auth/refreshTokenSchema";
import { RefreshTokenUseCase } from "@/useCases/auth/RefreshTokenUseCase";
import type { Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import {
  badRequest,
  internalServerError,
  notFound,
  success
} from "../helpers/http";
export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async execute(request: Request) {
    try {
      const { token } = refreshTokenSchema.parse(request.body);
      const result = await this.refreshTokenUseCase.execute(token);
      return success(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof StaffNotFoundError) {
        return notFound(error.message, error.code);
      }

      if (error instanceof TokenExpiredError) {
        return badRequest("Token expired");
      }

      if (error instanceof JsonWebTokenError) {
        return badRequest("Invalid token");
      }

      console.log(error);
      return internalServerError();
    }
  }
}
