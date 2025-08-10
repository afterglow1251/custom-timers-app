import { User } from 'src/app/shared/types/user.types';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
