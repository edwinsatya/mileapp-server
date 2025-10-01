import { User, UserResponse } from "../types/users";

export const createUser = async ({ name, email, password }: User): Promise<UserResponse> => {
  const mockApiUrl = process.env.MOCK_API_URL
  try {
    const user = await fetch(`${mockApiUrl}/users`, {  
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name, email, password }) 
    })
    return user.json()
  } catch (err) {
    throw err 
  }
}