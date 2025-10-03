import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { taskSchema } from "../schemas/taskSchema";
import { createTask } from "../services/mockApi";

class TaskController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = taskSchema.parse(req.body)
      const userId = req.decoded!.id
      const newTask = await createTask({ userId, ...task })
    
      res.status(201).json({ message: "New task created", task: newTask })
    } catch (err) {
      next(err)
    }
  }
}

export default TaskController