import bcrypt from 'bcrypt';
import { usersService, UsersService } from '../users/users.service';
import createHttpError from 'http-errors';
import { LoginUserDto } from './dto/login-user.dto';
import { MyJwtPayload, TokenPair } from './types/jwt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './utils/jwt.utils';

export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  generateTokens(payload: MyJwtPayload): TokenPair {
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  async login(dto: LoginUserDto): Promise<TokenPair> {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new createHttpError.Unauthorized('Invalid email or password');
    }

    const payload = { id: user.id, email: user.email };
    return this.generateTokens(payload);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      return this.generateTokens({ id: payload.id, email: payload.email });
    } catch {
      throw new createHttpError.Forbidden('Expired or invalid refresh token');
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    return user;
  }
}

export const authService = new AuthService(usersService);
