import {
  CpfAlreadyTakenError,
  EmailAlreadyTakenError,
  RaAlreadyTakenError
} from "@/errors/student";
import { createStudentSchema } from "@/schemas/student/createStudentSchema";
import { CreateStudentUseCase } from "@/useCases/student/CreateStudentUseCase";
import type { Request } from "express";
import { ZodError } from "zod";
import {
  conflict,
  created,
  internalServerError,
  invalidRequest
} from "../helpers/http";

export class CreateStudentController {
  constructor(private createStudentUseCase: CreateStudentUseCase) {}

  async execute(request: Request) {
    try {
      const params = createStudentSchema.parse(request.body);
      const student = await this.createStudentUseCase.execute(params);
      return created(student);
    } catch (error) {
      if (error instanceof ZodError) {
        return invalidRequest(error.errors[0].message);
      }

      if (
        error instanceof RaAlreadyTakenError ||
        error instanceof CpfAlreadyTakenError ||
        error instanceof EmailAlreadyTakenError
      ) {
        return conflict(error.message, error.code);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
