import { ErrorResponse } from "@/controllers/helpers/http";
import { ListStudentsController } from "@/controllers/student";
import { ListStudentsOutput } from "@/repositories/interfaces/IStudentRepository";
import { ListStudentsSchema } from "@/schemas/student/listStudentsSchema";
import { Student } from "@/types/Student";
import { ListStudentsUseCase } from "@/useCases/student/ListStudentsUseCase";
import { faker } from "@faker-js/faker";
import type { Request } from "express";

describe("ListStudentsController", () => {
  class ListStudentsUseCaseStub {
    async execute(params: ListStudentsSchema): Promise<ListStudentsOutput> {
      return {
        data: [
          {
            ra: faker.string.numeric(11),
            cpf: faker.string.numeric(11),
            name: faker.person.fullName(),
            email: faker.internet.email()
          }
        ],
        pagination: {
          total: 1,
          totalPages: 1,
          pageSize: params.pageSize,
          currentPage: params.page
        }
      };
    }
  }

  function makeSut() {
    const listStudentsUseCase =
      new ListStudentsUseCaseStub() as ListStudentsUseCase;
    const sut = new ListStudentsController(listStudentsUseCase);
    return { sut, listStudentsUseCase };
  }

  type HttpRequest = Request<
    any,
    any,
    any,
    {
      page: string;
      pageSize: string;
      name?: string;
    }
  >;

  const httpRequest = {
    query: {
      page: "1",
      pageSize: "10"
    }
  } as unknown as HttpRequest;

  it("should return 200 alongside body successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      data: expect.arrayContaining<Student>([
        {
          ra: expect.any(String),
          cpf: expect.any(String),
          name: expect.any(String),
          email: expect.any(String)
        }
      ]),
      pagination: expect.objectContaining({
        total: expect.any(Number),
        totalPages: expect.any(Number),
        pageSize: expect.any(Number),
        currentPage: expect.any(Number)
      })
    });
  });

  it("should call use case with correct params", async () => {
    const { sut, listStudentsUseCase } = makeSut();
    const spy = vi.spyOn(listStudentsUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      page: Number(httpRequest.query.page),
      pageSize: Number(httpRequest.query.pageSize),
      name: httpRequest.query.name
    });
  });

  it.each([
    {
      scenario: "page is not a number",
      httpRequest: {
        query: {
          ...httpRequest.query,
          page: "a"
        }
      },
      errorMessage: /must be a positive integer/i
    },
    {
      scenario: "pageSize is not a number",
      httpRequest: {
        query: {
          ...httpRequest.query,
          pageSize: "a"
        }
      },
      errorMessage: /must be a positive integer/i
    }
  ])(
    "should return 400 when $scenario",
    async ({ httpRequest, errorMessage }) => {
      const { sut } = makeSut();

      const response = (await sut.execute(
        httpRequest as HttpRequest
      )) as ErrorResponse;

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(errorMessage);
      expect(response.body.code).toBe("INVALID_REQUEST");
    }
  );

  it.todo(
    "should return 500 when use case throws an unknown error",
    async () => {}
  );
});
