import { dummyUser } from "../data/users";

export const checkUserCredentials = (email: string, password: string) => {
  const { email: dummyEmail, password: dummyPassword } = dummyUser
  if (email === dummyEmail && password === dummyPassword) {
    return { email: dummyUser.email, name: dummyUser.name, token: dummyUser.token }
  }
  return null
} 