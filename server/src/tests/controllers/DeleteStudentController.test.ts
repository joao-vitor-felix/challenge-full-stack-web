import { ErrorResponse } from "@/controllers/helpers/http";
import { DeleteStudentController } from "@/controllers/student";
import { StudentNotFoundError } from "@/errors/student";
import { DeleteStudentSchema } from "@/schemas/student";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("DeleteStudentController", () => {
  class DeleteStudentUseCaseStub {
    async execute(_ra: string) {
      return;
    }
  }

  function makeSut() {
    const deleteStudentUseCase =
      new DeleteStudentUseCaseStub() as DeleteStudentUseCase;
    const sut = new DeleteStudentController(deleteStudentUseCase);
    return { sut, deleteStudentUseCase };
  }

  type HttpRequest = Request<DeleteStudentSchema>;

  const httpRequest = {
    params: {
      ra: faker.string.numeric(11)
    }
  } as HttpRequest;

  it("should return 200 when delete student successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeUndefined();
  });

  it("should call use case with correct ra", async () => {
    const { sut, deleteStudentUseCase } = makeSut();
    const spy = vi.spyOn(deleteStudentUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.params.ra);
  });

  it.each([
    {
      scenario: "ra is not a string",
      httpRequest: {
        params: {
          ra: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "ra is less than 11 characters",
      httpRequest: {
        params: {
          ra: faker.string.numeric(10)
        }
      },
      errorMessage: /must contain 11/i
    },
    {
      scenario: "ra is more than 11 characters",
      httpRequest: {
        params: {
          ra: faker.string.numeric(12)
        }
      },
      errorMessage: /must contain 11/i
    }
  ])(
    "should return 400 when $scenario",
    async ({ httpRequest, errorMessage }) => {
      const { sut } = makeSut();

      const response = (await sut.execute(
        httpRequest as HttpRequest
      )) as ErrorResponse;

      expect(response.body.message).toMatch(errorMessage);
      expect(response.body.code).toBe("INVALID_REQUEST");
    }
  );

  it("should return 404 when student is not found", async () => {
    const { sut, deleteStudentUseCase } = makeSut();
    vi.spyOn(deleteStudentUseCase, "execute").mockRejectedValueOnce(
      new StudentNotFoundError()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
    expect(response.body.code).toBe("STUDENT_NOT_FOUND");
  });

  it("should return 500 when use case throws an unknown error", async () => {
    const { sut, deleteStudentUseCase } = makeSut();
    vi.spyOn(deleteStudentUseCase, "execute").mockRejectedValueOnce(
      new Error()
    );

    const response = (await sut.execute(httpRequest)) as ErrorResponse;
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/server error/i);
    expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
