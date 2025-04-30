import { PostgresAdapter } from "@/adapters";
import { GetStaffAccountController } from "@/controllers/student/GetStaffAcountController";
import { pool } from "@/db/db";
import { StaffRepository } from "@/repositories";
import { GetStaffAccountUseCase } from "@/useCases/staff/GetStaffAccountUseCase";

const db = new PostgresAdapter(pool);
const staffRepository = new StaffRepository(db);

export function makeGetStaffAccountController() {
  const getStaffAccountUseCase = new GetStaffAccountUseCase(staffRepository);
  const getStaffAccountController = new GetStaffAccountController(
    getStaffAccountUseCase
  );
  return getStaffAccountController;
}
