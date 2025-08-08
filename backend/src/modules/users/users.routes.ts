import Router from '@koa/router';
import { usersController } from './users.controller';
import { validate } from '../../common/middlewares/validate.middleware';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = new Router({ prefix: '/users' });

router.get(
  '/',
  authMiddleware,
  usersController.getAllUsers.bind(usersController),
);

router.get(
  '/:id',
  authMiddleware,
  usersController.getUserById.bind(usersController),
);

router.post(
  '/',
  authMiddleware,
  validate(CreateUserDto),
  usersController.createUser.bind(usersController),
);

router.patch(
  '/:id',
  authMiddleware,
  validate(UpdateUserDto),
  usersController.updateUser.bind(usersController),
);

router.delete(
  '/:id',
  authMiddleware,
  usersController.deleteUser.bind(usersController),
);

export default router;
