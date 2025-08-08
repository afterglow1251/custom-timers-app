import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getEnvOrThrow } from '../utils/env';
import { MyJwtPayload } from '../../modules/auth/types/jwt';

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers['authorization'];
  if (!authHeader) {
    throw new createHttpError.Unauthorized('Authorization header missing');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new createHttpError.Unauthorized('Authorization header malformed');
  }

  try {
    const payload = jwt.verify(
      token,
      getEnvOrThrow('ACCESS_SECRET'),
    ) as MyJwtPayload;
    ctx.state.user = payload;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token' };
  }
}
