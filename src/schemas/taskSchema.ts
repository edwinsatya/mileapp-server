import { z } from 'zod'

export const taskSchema = z.object({
  createdAt: z.string().optional(),
  title: z.string(),
  description: z.string(),
  status: z.string().optional().default('pending'),
  author: z.string(),
  goal: z.string()
})