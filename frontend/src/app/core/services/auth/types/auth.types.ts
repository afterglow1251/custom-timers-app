import { User, UserNoPassword } from 'src/app/shared/types/user.types';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserNoPassword;
  accessToken: string;
}
