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