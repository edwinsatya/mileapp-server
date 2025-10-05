import { z } from 'zod'

export const taskSchema = z.object({
  createdAt: z.string().optional(),
  title: z.string(),
  description: z.string(),
  status: z.number().optional().default(1),
  author: z.string().optional(),
  goal: z.string(),
  dueDate: z.string()
})