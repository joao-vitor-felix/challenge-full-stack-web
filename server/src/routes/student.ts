import {
  makeCreateStudentController,
  makeDeleteStudentController,
  makeListStudentsController,
  makeUpdateStudentController
} from "@/factories";
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

studentsRouter.patch("/:ra", async (req, res) => {
  const updateStudentController = makeUpdateStudentController();
  const { statusCode, body } = await updateStudentController.execute(req);
  res.status(statusCode).send(body);
});

studentsRouter.get("/", async (req, res) => {
  const listStudentsController = makeListStudentsController();
  const { statusCode, body } = await listStudentsController.execute(req);
  res.status(statusCode).send(body);
});
