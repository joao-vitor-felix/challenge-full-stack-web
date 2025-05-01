import { env } from "@/helpers/env";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/authMiddleware";
import { authRouter } from "./routes/auth";
import { staffRouter } from "./routes/staff";
import { studentsRouter } from "./routes/student";

const app = express();

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const limiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 1000,
  message: JSON.stringify({
    message: "Too many requests, please try again later."
  })
});

app.use(limiter);
app.use(
  morgan("combined", {
    skip: function (_req, res) {
      return res.statusCode < 400;
    }
  })
);

const corsOrigins = env.CORS_ORIGIN.split(",");
app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use("/auth", authRouter);
app.use("/students", authMiddleware, studentsRouter);
app.use("/staff", authMiddleware, staffRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
