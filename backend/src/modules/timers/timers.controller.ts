import { TimersService, timersService } from './timers.service';
import { TypedContext, ContextWithIdParam } from '../../common/types/koa';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';

export class TimersController {
  constructor(private readonly timersService: TimersService) {}

  async getAllTimers(ctx: TypedContext) {
    const userId = ctx.state.user!.id;

    ctx.body = await this.timersService.getAllByUser(userId);
  }

  async getTimerById(ctx: ContextWithIdParam) {
    const userId = ctx.state.user!.id;
    const timerId = +ctx.params.id;

    const timer = await this.timersService.getById(timerId, userId);

    ctx.body = timer;
  }

  async createTimer(ctx: TypedContext<CreateTimerDto>) {
    const userId = ctx.state.user!.id;

    const timer = await this.timersService.create(userId, ctx.request.body);

    ctx.status = 201;
    ctx.body = timer;
  }

  async updateTimer(ctx: TypedContext<UpdateTimerDto>) {
    const userId = ctx.state.user!.id;
    const timerId = +ctx.params.id;

    const updatedTimer = await this.timersService.update(
      timerId,
      userId,
      ctx.request.body,
    );

    ctx.body = updatedTimer;
  }

  async deleteTimer(ctx: ContextWithIdParam) {
    const userId = ctx.state.user!.id;
    const timerId = +ctx.params.id;

    await this.timersService.delete(timerId, userId);

    ctx.status = 204;
  }
}

export const timersController = new TimersController(timersService);
