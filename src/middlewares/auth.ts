import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  decoded?: {  id: string, email: string, name: string}
}

export function authentication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.token;
    if (!token || Array.isArray(token)) {
      throw { status: 401, message: "Token missing or invalid" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string; name: string };
    if (!decoded.id) { throw { status: 401, message: "Token invalid" } }
    req.decoded = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

export function authorization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (req?.decoded?.id == req.params.id) {
      next();
    } else {
      throw {
        status: 401,
        message: "Unauthorized Access"
      };
    }
  } catch (err) {
    next(err);
  }
}