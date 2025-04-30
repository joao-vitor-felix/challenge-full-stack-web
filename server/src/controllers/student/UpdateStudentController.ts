import { EmailAlreadyTakenError, StudentNotFoundError } from "@/errors/student";
import { updateStudentParamsSchema, updateStudentSchema } from "@/schemas";
import { UpdateStudentUseCase } from "@/useCases/student/UpdateStudentUseCase";
import type { Request } from "express";
import { ZodError } from "zod";
import {
  badRequest,
  conflict,
  internalServerError,
  notFound,
  success
} from "../helpers/http";

export class UpdateStudentController {
  constructor(private updateStudentUseCase: UpdateStudentUseCase) {}

  async execute(request: Request) {
    try {
      const { ra } = updateStudentParamsSchema.parse(request.params);
      const params = updateStudentSchema.parse(request.body);
      const student = await this.updateStudentUseCase.execute(ra, params);
      return success(student);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof StudentNotFoundError) {
        return notFound(error.message, error.code);
      }

      if (error instanceof EmailAlreadyTakenError) {
        return conflict(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
