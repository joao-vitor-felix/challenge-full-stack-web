import { env } from "@/helpers/env";
import cors from "cors";
import express from "express";
import { authMiddleware } from "./middlewares/authMiddleware";
import { authRouter } from "./routes/auth";
import { studentsRouter } from "./routes/student";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/students", authMiddleware, studentsRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
