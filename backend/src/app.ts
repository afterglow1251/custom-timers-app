import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import { SESSION_CONFIG } from './config/session';
import { getEnvOrThrow } from './utils/env';

const app = new Koa();
const router = new Router();

app.keys = [getEnvOrThrow('SESSION_SECRET')];

app
  .use(cors({ origin: getEnvOrThrow('FRONTEND_URL'), credentials: true }))
  .use(session(SESSION_CONFIG, app))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
