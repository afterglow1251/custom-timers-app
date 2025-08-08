import { Context } from 'koa';
import { MyJwtPayload } from '../../modules/auth/types/jwt';

export interface TypedContext<
  Body = unknown,
  Params extends Record<string, any> = Record<string, any>,
> extends Context {
  request: Context['request'] & { body: Body };
  params: Params;
  state: Context['state'] & { user?: MyJwtPayload };
}

export type ContextWithParams<Params extends Record<string, any>> =
  TypedContext<unknown, Params>;

export type ContextWithIdParam<Body = unknown> = TypedContext<
  Body,
  { id: string }
>;
