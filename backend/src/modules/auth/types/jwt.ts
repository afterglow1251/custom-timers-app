import { JwtPayload } from 'jsonwebtoken';

export interface MyJwtPayload extends JwtPayload {
  id: number;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
