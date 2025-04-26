import { z } from "zod";

export const listStudentsSchema = z
  .object({
    page: z.string().transform((val, ctx) => {
      const parsed = parseInt(val);

      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "page must be a positive integer"
        });

        return z.NEVER;
      }

      return parsed;
    }),
    pageSize: z.string().transform((val, ctx) => {
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
    name: z.string().optional()
  })
  .strict({
    message: "Some fields are not allowed"
  });

export type ListStudentsSchema = z.infer<typeof listStudentsSchema>;
