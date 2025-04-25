import { env } from "@/helpers/env";
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
