import { Context } from 'koa';

export interface TypedContext<Body = unknown> extends Context {
  request: Context['request'] & { body: Body };
}
