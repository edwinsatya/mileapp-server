import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { getTask } from "../services/mockApi";

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

export async function authorization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const currentUserId = req.decoded!.id
    const taskId = Number(req.params.id)
    const task = await getTask(taskId)
    if (!task || typeof task === 'string') { throw { status: 404, message: 'Task Not Found' } }
    if (Number(currentUserId) === Number(task.userId)) {
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