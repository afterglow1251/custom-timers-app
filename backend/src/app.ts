import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { getEnvOrThrow } from './common/utils/env';
import { errorHandler } from './common/middlewares/error-handler.middleware';
import usersRoutes from './modules/users/users.routes';
import authRoutes from './modules/auth/auth.routes';

const app = new Koa();
const router = new Router({ prefix: '/api' });

app.keys = [getEnvOrThrow('SESSION_SECRET')];

router.use(usersRoutes.routes()).use(usersRoutes.allowedMethods());
router.use(authRoutes.routes()).use(authRoutes.allowedMethods());

app
  .use(errorHandler)
  .use(cors({ origin: getEnvOrThrow('FRONTEND_URL'), credentials: true }))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
