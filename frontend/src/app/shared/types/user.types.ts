export interface User {
  id: number;
  email: string;
  password: string;
  updatedAt: string;
  createdAt: string;
}

export type UserNoPassword = Omit<User, 'password'>;
