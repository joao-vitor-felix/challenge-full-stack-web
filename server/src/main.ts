import { env } from "@/helpers/env";
import cors from "cors";
import express from "express";
import { staffRouter } from "./routes/staff";
import { studentsRouter } from "./routes/student";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/students", studentsRouter);
app.use("/staffs", staffRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
