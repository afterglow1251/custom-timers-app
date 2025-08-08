import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { getEnvOrThrow } from './common/utils/env';
import { errorHandler } from './common/middlewares/error-handler.middleware';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import timersRouter from './modules/timers/timers.routes';

const app = new Koa();
const router = new Router({ prefix: '/api' });

router.use(usersRoutes.routes()).use(usersRoutes.allowedMethods());
router.use(authRoutes.routes()).use(authRoutes.allowedMethods());
router.use(timersRouter.routes()).use(timersRouter.allowedMethods());

app
  .use(errorHandler)
  .use(cors({ origin: getEnvOrThrow('FRONTEND_URL'), credentials: true }))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
