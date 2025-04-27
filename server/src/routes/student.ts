import {
  makeCreateStudentController,
  makeDeleteStudentController,
  makeListStudentsController,
  makeUpdateStudentController
} from "@/factories";
import { permissionMiddleware } from "@/middlewares/permissionMiddleware";
import { Router } from "express";

export const studentsRouter = Router();

studentsRouter.post("/", permissionMiddleware, async (req, res) => {
  const createStudentController = makeCreateStudentController();
  const { statusCode, body } = await createStudentController.execute(req);
  res.status(statusCode).send(body);
});

studentsRouter.delete("/:ra", permissionMiddleware, async (req, res) => {
  const deleteStudentController = makeDeleteStudentController();
  const { statusCode, body } = await deleteStudentController.execute(req);
  res.status(statusCode).send(body);
});

studentsRouter.patch("/:ra", permissionMiddleware, async (req, res) => {
  const updateStudentController = makeUpdateStudentController();
  const { statusCode, body } = await updateStudentController.execute(req);
  res.status(statusCode).send(body);
});

studentsRouter.get("/", async (req, res) => {
  const listStudentsController = makeListStudentsController();
  const { statusCode, body } = await listStudentsController.execute(req);
  res.status(statusCode).send(body);
});
