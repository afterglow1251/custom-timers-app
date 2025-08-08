import { Next } from 'koa';
import { TypedContext } from '../types/koa';

export async function errorHandler(ctx: TypedContext, next: Next) {
  try {
    await next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      ctx.status = (err as any).status || 500;
      ctx.body = { error: err.message };
      console.error(err);
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Internal Server Error' };
      console.error('Unknown error:', err);
    }
  }
}
