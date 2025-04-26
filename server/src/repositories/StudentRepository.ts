import { IDatabaseConnection } from "@/adapters/interfaces/IDatabaseConnection";
import { UpdateStudentSchema } from "@/schemas/student";
import { CreateStudentSchema } from "@/schemas/student/createStudentSchema";
import { Student } from "@/types/Student";
import {
  DataAvailabilityParams,
  IStudentRepository,
  ListStudentsOutput
} from "./interfaces/IStudentRepository";

export class StudentRepository implements IStudentRepository {
  constructor(private db: IDatabaseConnection) {}

  async create(params: CreateStudentSchema): Promise<Student> {
    const student = await this.db.query<Student>(
      `insert into students(ra, cpf, name, email)
       values ($1, $2, $3, $4)
       returning *`,
      [params.ra, params.cpf, params.name, params.email]
    );

    return student[0];
  }

  async findStudentsWithMatchingData(
    params: DataAvailabilityParams
  ): Promise<DataAvailabilityParams[]> {
    const students = await this.db.query<DataAvailabilityParams>(
      `select * from students
      where ra = $1
      or cpf = $2
      or email = $3
      limit 1`,
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

  async update(
    ra: string,
    params: UpdateStudentSchema
  ): Promise<Student | null> {
    const [student] = await this.db.query<Student>(
      `update students
      set name = $1,
      email = $2
      where ra = $3
      returning *`,
      [params.name, params.email, ra]
    );

    return student ?? null;
  }

  async list(
    page: number,
    pageSize: number,
    name = ""
  ): Promise<ListStudentsOutput> {
    const countQuery = this.db.query<{ count: string }>(
      `select count(*) from students
       where ($1 = '' or name ilike '%' || $1 || '%')`,
      [name]
    );

    const studentsQuery = this.db.query<Student>(
      `select * from students
      where ($1 = '' or name ilike '%' || $1 || '%')
      order by name
      limit $2
      offset $3`,
      [name, pageSize, pageSize * (page - 1)]
    );

    const [[countResult], students] = await Promise.all([
      countQuery,
      studentsQuery
    ]);

    const total = parseInt(countResult.count);
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: students,
      pagination: {
        total,
        totalPages,
        pageSize,
        currentPage: page
      }
    };
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
