import { makeCreateStaffController } from "@/factories/staff";
import { Router } from "express";

export const staffRouter = Router();

staffRouter.post("/", async (req, res) => {
  const createStaffController = makeCreateStaffController();
  const { statusCode, body } = await createStaffController.execute(req);
  res.status(statusCode).send(body);
});
