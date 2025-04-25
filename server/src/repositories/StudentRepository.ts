import { IDatabaseConnection } from "@/adapters/interfaces/IDatabaseConnection";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";
import {
  DataAvailabilityParams,
  IStudentRepository
} from "./interfaces/IStudentRepository";

export class StudentRepository implements IStudentRepository {
  constructor(private db: IDatabaseConnection) {}

  async create(params: CreateStudentSchema): Promise<Student> {
    const student = await this.db.query<Student>(
      `insert into students(ra, cpf, name, email) values ($1, $2, $3, $4) returning *`,
      [params.ra, params.cpf, params.name, params.email]
    );

    return student[0];
  }

  async findStudentsWithMatchingData(
    params: DataAvailabilityParams
  ): Promise<DataAvailabilityParams[]> {
    const students = await this.db.query<DataAvailabilityParams>(
      `select * from students where ra = $1 or cpf = $2 or email = $3 limit 1`,
      [params.ra, params.cpf, params.email]
    );

    return students;
  }

  async findByRa(ra: string): Promise<Student | null> {
    const student = await this.db.query<Student>(
      `select * from students where ra = $1`,
      [ra]
    );

    if (!student.length) {
      return null;
    }

    return student[0];
  }

  async delete(ra: string): Promise<void | null> {
    const student = await this.db.query<Student>(
      `delete from students where ra = $1 returning *`,
      [ra]
    );

    if (!student.length) {
      return null;
    }
  }
}
