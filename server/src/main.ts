import { env } from "@/helpers/env";
import cors from "cors";
import express from "express";
import { studentsRouter } from "./routes/student";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/students", studentsRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
