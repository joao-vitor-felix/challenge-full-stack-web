import { Staff } from "@/types/Staff";

declare module "express" {
  interface Request {
    staff?: {
      id: string;
      role: Staff["role"];
    };
  }
}
