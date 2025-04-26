import { z } from "zod";

export const listStudentsSchema = z
  .object({
    pageSize: z
      .string({
        message: "pageSize must be a string"
      })
      .transform((val, ctx) => {
        const parsed = parseInt(val);

        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "pageSize must be a positive integer"
          });

          return z.NEVER;
        }

        return parsed;
      }),
    pageNumber: z
      .string({
        message: "pageNumber must be a string"
      })
      .transform((val, ctx) => {
        const parsed = parseInt(val);

        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "pageNumber must be a positive integer"
          });

          return z.NEVER;
        }

        return parsed;
      }),
    name: z
      .string({
        message: "name must be a string"
      })
      .min(1, {
        message: "name must have at least 1 character"
      })
      .optional()
  })
  .strict({
    message: "Some fields are not allowed"
  });

export type ListStudentsSchema = z.infer<typeof listStudentsSchema>;
