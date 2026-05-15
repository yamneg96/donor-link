import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from '../errors';

/**
 * Zod schema validation middleware.
 * Validates request body, query, and/or params against provided schemas.
 */
export function validate(schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query) as Record<string, string>;
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params) as Record<string, string>;
      }
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(err.message);
        });
        next(new ValidationError('Validation failed', fieldErrors));
      } else {
        next(error);
      }
    }
  };
}
