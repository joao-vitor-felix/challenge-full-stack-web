import { PasswordHasherAdapter, PostgresAdapter } from "@/adapters";
import { SignUpController } from "@/controllers/auth";
import { pool } from "@/db/db";
import { StaffRepository } from "@/repositories";
import { SignUpUseCase } from "@/useCases";

const db = new PostgresAdapter(pool);
const staffRepository = new StaffRepository(db);

export function makeSignUpController() {
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const signUpUseCase = new SignUpUseCase(
    passwordHasherAdapter,
    staffRepository
  );
  const signUpController = new SignUpController(signUpUseCase);
  return signUpController;
}
