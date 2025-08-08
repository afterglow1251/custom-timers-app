import { UsersService, usersService } from './users.service';
import { TypedContext } from '../../common/types/koa';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async getAllUsers(ctx: TypedContext) {
    ctx.body = await this.usersService.getAllUsers();
  }

  async getUserById(ctx: TypedContext) {
    const id = Number(ctx.params.id);
    const user = await this.usersService.findById(id);
    ctx.body = user;
  }

  async createUser(ctx: TypedContext<CreateUserDto>) {
    const user = await this.usersService.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = user;
  }

  async updateUser(ctx: TypedContext<UpdateUserDto>) {
    const id = Number(ctx.params.id);
    const dto = ctx.request.body;
    const updatedUser = await this.usersService.update(id, dto);
    ctx.body = updatedUser;
  }

  async deleteUser(ctx: TypedContext) {
    const id = Number(ctx.params.id);
    await this.usersService.delete(id);
    ctx.status = 204;
  }
}

export const usersController = new UsersController(usersService);
