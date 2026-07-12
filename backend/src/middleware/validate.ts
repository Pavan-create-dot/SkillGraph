import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

/**
 * Generic Zod validation middleware factory.
 * Validates req.body, req.params, and req.query against the provided schema.
 *
 * @param schema - A Zod object schema with optional body, params, query keys
 */
export const validate = (schema: ZodObject<any, any, any>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};
