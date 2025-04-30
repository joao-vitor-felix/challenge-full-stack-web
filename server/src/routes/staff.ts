import { makeGetStaffAccountController } from "@/factories/staff";
import { Router } from "express";

export const staffRouter = Router();

staffRouter.get("/account", async (req, res) => {
  const getStaffAccountController = makeGetStaffAccountController();
  const { statusCode, body } = await getStaffAccountController.execute(req);
  res.status(statusCode).send(body);
});
