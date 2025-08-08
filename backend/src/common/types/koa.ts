import { Context } from 'koa';
import { MyJwtPayload } from '../../modules/auth/types/jwt';

export interface TypedContext<Body = unknown> extends Context {
  request: Context['request'] & { body: Body };
  state: Context['state'] & { user?: MyJwtPayload };
}
