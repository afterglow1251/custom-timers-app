import { TypedContext } from '../../types/koa';

export function setRefreshTokenCookie(ctx: TypedContext, refreshToken: string) {
  ctx.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2592000000, // 30 days
    path: '/',
  });
}
