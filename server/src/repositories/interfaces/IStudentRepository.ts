import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";

export interface IStudentRepository {
  create(params: CreateStudentSchema): Promise<Student>;
  findStudentsWithMatchingData(
    params: DataAvailabilityParams
  ): Promise<DataAvailabilityParams[]>;
}

export type DataAvailabilityParams = Omit<Student, "name">;
