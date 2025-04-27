import { makeSignInController, makeSignUpController } from "@/factories/auth";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/sign-up", async (req, res) => {
  const signUpController = makeSignUpController();
  const { statusCode, body } = await signUpController.execute(req);
  res.status(statusCode).send(body);
});

authRouter.post("/sign-in", async (req, res) => {
  const signInController = makeSignInController();
  const { statusCode, body } = await signInController.execute(req);
  res.status(statusCode).send(body);
});
