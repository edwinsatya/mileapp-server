export type Task = {
  title: string
  description: string
  status?: string
  author: string
  goal: string
  userId: string
};

export interface TaskResponse extends Task {
  id: string
}