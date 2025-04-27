import { z } from "zod";

export const refreshTokenSchema = z
  .object({
    token: z
      .string({
        message: "token must be a string"
      })
      .jwt({
        message: "Invalid token"
      })
  })
  .strict({
    message: "Some fields are not allowed"
  });
