import { PostgresAdapter } from "@/adapters/PostgresAdapter";
import { DeleteStudentController } from "@/controllers/student";
import { CreateStudentController } from "@/controllers/student/CreateStudentController";
import { pool } from "@/db/db";
import { StudentRepository } from "@/repositories/StudentRepository";
import { CreateStudentUseCase } from "@/useCases/student/CreateStudentUseCase";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";

const db = new PostgresAdapter(pool);
const studentRepository = new StudentRepository(db);

export function makeCreateStudentController() {
  const createStudentUseCase = new CreateStudentUseCase(studentRepository);
  const createStudentController = new CreateStudentController(
    createStudentUseCase
  );
  return createStudentController;
}

export function makeDeleteStudentController() {
  const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository);
  const deleteStudentController = new DeleteStudentController(
    deleteStudentUseCase
  );
  return deleteStudentController;
}
