import {
  makeCreateStudentController,
  makeDeleteStudentController
} from "@/factories/student";
import { Router } from "express";

export const studentsRouter = Router();

studentsRouter.post("/", async (req, res) => {
  const createStudentController = makeCreateStudentController();
  const { statusCode, body } = await createStudentController.execute(req);
  res.status(statusCode).send(body);
});

studentsRouter.delete("/:ra", async (req, res) => {
  const deleteStudentController = makeDeleteStudentController();
  const { statusCode, body } = await deleteStudentController.execute(req);
  res.status(statusCode).send(body);
});
