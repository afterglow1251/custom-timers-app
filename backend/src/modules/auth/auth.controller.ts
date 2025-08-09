import { TypedContext } from '../../common/types/koa';
import { authService } from './auth.service';
import { UsersService, usersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { setRefreshTokenCookie } from '../../common/utils/cookies';
import { REFRESH_TOKEN } from './constants/auth.constants';
import { CheckEmailDto } from './dto/check-email.dto';

export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  async register(ctx: TypedContext<RegisterUserDto>) {
    const user = await this.usersService.create(ctx.request.body);

    const { accessToken, refreshToken } = authService.generateTokens({
      id: user.id,
      email: user.email,
    });

    setRefreshTokenCookie(ctx, refreshToken);

    ctx.status = 201;
    ctx.body = { user, accessToken };
  }

  async login(ctx: TypedContext<LoginUserDto>) {
    const tokens = await authService.login(ctx.request.body);

    setRefreshTokenCookie(ctx, tokens.refreshToken);

    ctx.body = { accessToken: tokens.accessToken };
  }

  async refresh(ctx: TypedContext) {
    const refreshToken = ctx.cookies.get(REFRESH_TOKEN);
    if (!refreshToken) {
      ctx.throw(401, 'No refresh token');
    }

    const tokens = await authService.refresh(refreshToken);

    setRefreshTokenCookie(ctx, tokens.refreshToken);

    ctx.body = { accessToken: tokens.accessToken };
  }

  async logout(ctx: TypedContext) {
    ctx.cookies.set(REFRESH_TOKEN, '', { httpOnly: true, maxAge: 0 });
    ctx.status = 204;
  }

  async checkEmail(ctx: TypedContext<CheckEmailDto>) {
    const { email } = ctx.request.body;
    const user = await this.usersService.findByEmail(email);

    ctx.body = { exists: !!user };
  }
}

export const authController = new AuthController(usersService);
