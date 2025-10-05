export type Task = {
  title: string
  description: string
  status?: number
  author?: string
  goal: string
  dueDate: string
  userId: string
};

export interface TaskResponse extends Task {
  id: string
}