import { PostgresAdapter } from "@/adapters/PostgresAdapter";
import { CreateStudentController } from "@/controllers/student/CreateStudentController";
import { pool } from "@/db/db";
import { StudentRepository } from "@/repositories/StudentRepository";
import { CreateStudentUseCase } from "@/useCases/student/CreateStudentUseCase";

export function makeCreateStudentController() {
  const db = new PostgresAdapter(pool);
  const studentRepository = new StudentRepository(db);
  const createStudentUseCase = new CreateStudentUseCase(studentRepository);
  const createStudentController = new CreateStudentController(
    createStudentUseCase
  );
  return createStudentController;
}
