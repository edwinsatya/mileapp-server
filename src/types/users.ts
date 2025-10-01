export type User = {
  name: string;
  email: string;
  password: string;
};

export interface UserResponse extends User {
  id: string
}