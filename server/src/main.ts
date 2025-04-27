import { env } from "@/helpers/env";
import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { studentsRouter } from "./routes/student";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/students", studentsRouter);
app.use("/auth", authRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
