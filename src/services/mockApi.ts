import { Task, TaskResponse } from "../types/task";
import { User, UserResponse } from "../types/users";

export const createUser = async ({ name, email, password }: User): Promise<UserResponse> => {
  const mockApiUrl = process.env.MOCK_API_URL
  try {
    const response = await fetch(`${mockApiUrl}/users`, {  
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name, email, password }) 
    })
    return response.json()
  } catch (err) {
    throw err 
  }
}

export const getUsers = async (id?: string, email?: string): Promise<UserResponse[]> => {
  const mockApiUrl = process.env.MOCK_API_URL
  const url = id ? `${mockApiUrl}/users/${id}` : `${mockApiUrl}/users`
  try {
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const data = await response.json()
    if (data[0]?.length === 1) { throw { status: 404, message: 'User Not Found' } }
    if (id) { return [data] }
    if (email) { return data.filter((user: UserResponse) => user.email === email) }
    return data
  } catch (err) {
    throw err
  }
}

export const createTask = async (task: Task): Promise<TaskResponse> => {
  const mockApiUrl = process.env.MOCK_API_URL
  try {
    const response = await fetch(`${mockApiUrl}/tasks`, {  
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(task) 
    })
    return response.json()
  } catch (err) {
    throw err 
  }
}

interface GetTaskParams {
  filter?: Record<string, string>
  page?: number
  limit?: number
  sortBy?: keyof TaskResponse   
  sortOrder?: 'asc' | 'desc' 
}

export const getTasks = async ({ filter = {}, page = 1, limit = 10, sortBy, sortOrder }: GetTaskParams): Promise<TaskResponse[]> => {
  const mockApiUrl = process.env.MOCK_API_URL
  const url = new URL(`${mockApiUrl}/tasks`);
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
  }

  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  try {
    const response = await fetch(url.toString(), {
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' }
    })

    let tasks: TaskResponse[] = await response.json()

    if (sortBy) {
      tasks.sort((a, b) => {
        const aValue = a[sortBy] ?? null
        const bValue = b[sortBy] ?? null

        if (aValue === bValue) return 0

        if (aValue === null) return 1
        if (bValue === null) return -1

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        const aStr = String(aValue)
        const bStr = String(bValue)
        if (sortOrder === 'asc') return aStr.localeCompare(bStr)
        return bStr.localeCompare(aStr)
      })
    }

    return tasks
  } catch (err) {
    throw err
  }
}

export async function getTotalTask(): Promise<number> {
  const mockApiUrl = process.env.MOCK_API_URL
  const url = new URL(`${mockApiUrl}/tasks`);

  const response = await fetch(url.toString(), {
    method: 'GET', 
    headers: { 'Content-Type': 'application/json' }
  })

  const data = await response.json()
  return data.length
}