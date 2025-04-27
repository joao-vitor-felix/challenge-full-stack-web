import type { NextFunction, Request, Response } from "express";

export function permissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.staff) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  if (req.staff.role !== "REGISTRAR") {
    res.status(403).send({ message: "Forbidden" });
    return;
  }

  next();
}
