import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { UpdateStudentSchema } from "@/schemas/student/updateStudentSchema";
import { Student } from "@/types/Student";

export interface IStudentRepository {
  create(params: CreateStudentSchema): Promise<Student>;
  findStudentWithMatchingData(
    params: DataAvailabilityParams
  ): Promise<Student | null>;
  findByRa(ra: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  update(ra: string, params: UpdateStudentSchema): Promise<Student | null>;
  list(
    page: number,
    pageSize: number,
    name?: string
  ): Promise<ListStudentsOutput>;
  delete(ra: string): Promise<void | null>;
}

export type DataAvailabilityParams = Omit<Student, "name">;

export type ListStudentsOutput = {
  data: Student[];
  pagination: {
    total: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
};
