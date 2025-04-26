import { listStudentsSchema } from "@/schemas/student/listStudentsSchema";
import { ListStudentsUseCase } from "@/useCases/student/ListStudentsUseCase";
import type { Request } from "express";
import { ZodError } from "zod";
import { internalServerError, invalidRequest, success } from "../helpers/http";

export class ListStudentsController {
  constructor(private listStudentsUseCase: ListStudentsUseCase) {}

  async execute(request: Request) {
    try {
      const { pageNumber, pageSize, name } = listStudentsSchema.parse(
        request.query
      );

      const result = await this.listStudentsUseCase.execute({
        pageNumber,
        pageSize,
        name
      });

      return success(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return invalidRequest(error.errors[0].message);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
