import { env } from "@/helpers/env";
import type { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authorization.split(" ")[1];
    const decodedToken = verify(token, env.JWT_SECRET) as JwtPayload;

    req.staff = {
      id: decodedToken.sub!,
      role: decodedToken.role
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
}
