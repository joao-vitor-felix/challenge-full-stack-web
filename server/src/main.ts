import { env } from "@/helpers/env";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
