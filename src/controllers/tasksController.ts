import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { taskSchema } from "../schemas/taskSchema";
import { createTask, getTasks, getTotalTask } from "../services/mockApi";
import { TaskResponse } from "../types/task";

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

  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sortBy, sortOrder, ...queryFilters } = req.query
      const pageNum = page ? Number(page) : 1
      const limitNum = limit ? Number(limit) : 10
      const filters: Record<string, string> = {}
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value) filters[key] = String(value)
      })

      const totalTasks = await getTotalTask()

      const tasks: TaskResponse[] = await getTasks({
        filter: filters,
        page: pageNum,
        limit: limitNum,
        sortBy: sortBy as keyof TaskResponse,
        sortOrder: sortOrder as 'asc' | 'desc'
      })

      const meta = {
        page: pageNum,
        limit: limitNum,
        total: tasks.length,
        totalPages: Math.ceil(totalTasks / limitNum)
      }

      res.status(200).json({ tasks, meta })
    } catch (err) {
      next(err)
    }
  }
}

export default TaskController