import { PasswordHasherAdapter, PostgresAdapter } from "@/adapters";
import { JwtTokenAdapter } from "@/adapters/JwtTokenAdapter";
import { SignInController, SignUpController } from "@/controllers/auth";
import { pool } from "@/db/db";
import { StaffRepository } from "@/repositories";
import { SignUpUseCase } from "@/useCases";
import { SignInUseCase } from "@/useCases/auth/SignInUseCase";

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

export function makeSignInController() {
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const jwtTokenAdapter = new JwtTokenAdapter();
  const signInUseCase = new SignInUseCase(
    passwordHasherAdapter,
    jwtTokenAdapter,
    staffRepository
  );
  const signInController = new SignInController(signInUseCase);
  return signInController;
}
