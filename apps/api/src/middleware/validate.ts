import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/errors";

type ValidateTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: ValidateTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      throw ApiError.badRequest("Validation failed", errors);
    }
    // Replace with parsed/coerced data
    req[target] = result.data;
    next();
  };

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "root";
    if (!formatted[path]) formatted[path] = [];
    formatted[path].push(issue.message);
  }
  return formatted;
}