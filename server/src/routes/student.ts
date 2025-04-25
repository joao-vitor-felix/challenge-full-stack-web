import { makeCreateStudentController } from "@/factories/student";
import { Router } from "express";

export const studentsRouter = Router();

studentsRouter.post("/", async (req, res) => {
  const createStudentController = makeCreateStudentController();
  const { statusCode, body } = await createStudentController.execute(req);
  res.status(statusCode).send(body);
});
