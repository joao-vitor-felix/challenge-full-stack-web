import { PasswordHasherAdapter, PostgresAdapter } from "@/adapters";
import { CreateStaffController } from "@/controllers/staff";
import { pool } from "@/db/db";
import { StaffRepository } from "@/repositories";
import { CreateStaffUseCase } from "@/useCases";

const db = new PostgresAdapter(pool);
const staffRepository = new StaffRepository(db);

export function makeCreateStaffController() {
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const createStaffUseCase = new CreateStaffUseCase(
    passwordHasherAdapter,
    staffRepository
  );
  const createStaffController = new CreateStaffController(createStaffUseCase);
  return createStaffController;
}
