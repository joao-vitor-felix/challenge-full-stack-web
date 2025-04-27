import { listStudentsSchema } from "@/schemas/student/listStudentsSchema";
import { ListStudentsUseCase } from "@/useCases/student/ListStudentsUseCase";
import type { Request } from "express";
import { ZodError } from "zod";
import { badRequest, internalServerError, success } from "../helpers/http";

export class ListStudentsController {
  constructor(private listStudentsUseCase: ListStudentsUseCase) {}

  async execute(request: Request) {
    try {
      const { page, pageSize, name } = listStudentsSchema.parse(request.query);

      const result = await this.listStudentsUseCase.execute({
        page,
        pageSize,
        name
      });

      return success(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
