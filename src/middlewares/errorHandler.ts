import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface CustomError extends Error {
  status?: number;
  details?: any;
}

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      })),
    });
  }

  // Custom error with status and message
  const customError = err as CustomError;
  if (customError.status && customError.message) {
    return res.status(customError.status).json({
      error: customError.message,
      details: customError.details || null,
    });
  }

  // Fallback for unexpected errors
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}

export default errorHandler;