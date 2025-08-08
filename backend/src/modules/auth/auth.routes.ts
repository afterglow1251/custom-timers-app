import Router from '@koa/router';
import { authController } from './auth.controller';
import { validate } from '../../common/middlewares/validate.middleware';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = new Router({ prefix: '/auth' });

router.post(
  '/register',
  validate(RegisterUserDto),
  authController.register.bind(authController),
);

router.post(
  '/login',
  validate(LoginUserDto),
  authController.login.bind(authController),
);

router.post(
  '/refresh',
  authMiddleware,
  authController.refresh.bind(authController),
);

router.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController),
);

export default {
  routes: () => router.routes(),
  allowedMethods: () => router.allowedMethods(),
};
