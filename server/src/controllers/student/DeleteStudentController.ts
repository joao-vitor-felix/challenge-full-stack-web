import { StudentNotFoundError } from "@/errors/student";
import { deleteStudentSchema } from "@/schemas/student/deleteStudentSchema";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";
import type { Request } from "express";
import { ZodError } from "zod";
import {
  badRequest,
  internalServerError,
  notFound,
  success
} from "../helpers/http";

export class DeleteStudentController {
  constructor(private deleteStudentUseCase: DeleteStudentUseCase) {}

  async execute(request: Request) {
    try {
      const { ra } = deleteStudentSchema.parse(request.params);
      await this.deleteStudentUseCase.execute(ra);
      return success();
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof StudentNotFoundError) {
        return notFound(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
