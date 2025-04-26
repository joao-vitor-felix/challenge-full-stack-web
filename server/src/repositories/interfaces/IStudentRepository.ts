import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { UpdateStudentSchema } from "@/schemas/student/updateStudentSchema";
import { Student } from "@/types/Student";

export interface IStudentRepository {
  create(params: CreateStudentSchema): Promise<Student>;
  findStudentsWithMatchingData(
    params: DataAvailabilityParams
  ): Promise<DataAvailabilityParams[]>;
  findByRa(ra: string): Promise<Student | null>;
  update(ra: string, params: UpdateStudentSchema): Promise<Student | null>;
  delete(ra: string): Promise<void | null>;
}

export type DataAvailabilityParams = Omit<Student, "name">;
