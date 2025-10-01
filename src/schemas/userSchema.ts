import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6),
})