import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { taskSchema } from "../schemas/taskSchema";
import { createTask, deleteTask, getTask, getTasks, getTotalTask, getUserByEmail, updateTask } from "../services/mockApi";
import { TaskResponse } from "../types/task";

class TaskController {
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

  static async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id)
      const task = await getTask(taskId)
      res.status(200).json({ task })
    } catch (error) {
      next()
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = taskSchema.parse(req.body)
      const findUser = await getUserByEmail(req.decoded!.email)
      if (!findUser.length) { throw { status: 404, message: 'User Not Found' } }
      const userId = req.decoded!.id
      const author = req.decoded!.name
      const dueDate =  new Date(task.dueDate).toISOString()
      const newTask = await createTask({ ...task, userId, author, dueDate })
    
      res.status(201).json({ message: "New task created", task: newTask })
    } catch (err) {
      next(err)
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = taskSchema.parse(req.body)
      const taskId = Number(req.params.id)
      const userId = req.decoded!.id
      const author = req.decoded!.name
      const dueDate =  new Date(task.dueDate).toISOString()
      const updatedTask = await updateTask(taskId, { ...task, userId, author, dueDate })

      res.status(200).json({ message: "Task updated", task: updatedTask })
    } catch (err) {
      next(err)
    }
  }

  static async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id)
      const userId = Number(req.decoded!.id)
      const deletedTask = await deleteTask(taskId, userId)

      res.status(200).json({ message: "Task deleted", task: deletedTask })
    } catch (err) {
      next(err)
    }
  }
}

export default TaskController