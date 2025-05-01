import { CacheAdapter } from "@/adapters/CacheAdapter";
import { PostgresAdapter } from "@/adapters/PostgresAdapter";
import {
  DeleteStudentController,
  ListStudentsController
} from "@/controllers/student";
import { CreateStudentController } from "@/controllers/student/CreateStudentController";
import { UpdateStudentController } from "@/controllers/student/UpdateStudentController";
import { pool } from "@/db/db";
import { StudentRepository } from "@/repositories/StudentRepository";
import { CreateStudentUseCase } from "@/useCases/student/CreateStudentUseCase";
import { DeleteStudentUseCase } from "@/useCases/student/DeleteStudentUseCase";
import { ListStudentsUseCase } from "@/useCases/student/ListStudentsUseCase";
import { UpdateStudentUseCase } from "@/useCases/student/UpdateStudentUseCase";

const db = new PostgresAdapter(pool);
const studentRepository = new StudentRepository(db);
const cache = new CacheAdapter();

export function makeCreateStudentController() {
  const createStudentUseCase = new CreateStudentUseCase(
    cache,
    studentRepository
  );
  const createStudentController = new CreateStudentController(
    createStudentUseCase
  );
  return createStudentController;
}

export function makeDeleteStudentController() {
  const deleteStudentUseCase = new DeleteStudentUseCase(
    cache,
    studentRepository
  );
  const deleteStudentController = new DeleteStudentController(
    deleteStudentUseCase
  );
  return deleteStudentController;
}

export function makeUpdateStudentController() {
  const updateStudentUseCase = new UpdateStudentUseCase(
    cache,
    studentRepository
  );
  const updateStudentController = new UpdateStudentController(
    updateStudentUseCase
  );
  return updateStudentController;
}

export function makeListStudentsController() {
  const listStudentsUseCase = new ListStudentsUseCase(cache, studentRepository);
  const listStudentsController = new ListStudentsController(
    listStudentsUseCase
  );
  return listStudentsController;
}
