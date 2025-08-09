import { UsersService, usersService } from './users.service';
import { ContextWithIdParam, TypedContext } from '../../common/types/koa';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckEmailDto } from './dto/check-email.dto';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async getAllUsers(ctx: TypedContext) {
    ctx.body = await this.usersService.getAllUsers();
  }

  async getUserById(ctx: ContextWithIdParam) {
    const userId = +ctx.params.id;

    const user = await this.usersService.getById(userId);

    ctx.body = user;
  }

  async createUser(ctx: TypedContext<CreateUserDto>) {
    const user = await this.usersService.create(ctx.request.body);

    ctx.status = 201;
    ctx.body = user;
  }

  async updateUser(ctx: TypedContext<UpdateUserDto>) {
    const userId = +ctx.params.id;

    const updatedUser = await this.usersService.update(
      userId,
      ctx.request.body,
    );

    ctx.body = updatedUser;
  }

  async deleteUser(ctx: ContextWithIdParam) {
    const userId = +ctx.params.id;

    await this.usersService.delete(userId);

    ctx.status = 204;
  }

  async checkEmail(ctx: TypedContext<CheckEmailDto>) {
    const { email } = ctx.request.body;
    const user = await this.usersService.findByEmail(email);

    ctx.body = { exists: !!user };
  }
}

export const usersController = new UsersController(usersService);
