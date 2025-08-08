import Router from '@koa/router';
import { validate } from '../../common/middlewares/validate.middleware';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { timersController } from './timers.controller';

const router = new Router({ prefix: '/timers' });

router.get(
  '/',
  authMiddleware,
  timersController.getAllTimers.bind(timersController),
);

router.get(
  '/:id',
  authMiddleware,
  timersController.getTimerById.bind(timersController),
);

router.post(
  '/',
  authMiddleware,
  validate(CreateTimerDto),
  timersController.createTimer.bind(timersController),
);

router.patch(
  '/:id',
  authMiddleware,
  validate(UpdateTimerDto),
  timersController.updateTimer.bind(timersController),
);

router.delete(
  '/:id',
  authMiddleware,
  timersController.deleteTimer.bind(timersController),
);

export default router;
