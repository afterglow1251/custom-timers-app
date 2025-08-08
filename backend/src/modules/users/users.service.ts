import bcrypt from 'bcrypt';
import { User } from '../database/models/User';
import createHttpError from 'http-errors';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UsersService {
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return User.findAll();
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = dto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new createHttpError.Conflict('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const { email, password } = dto;

    const user = await this.findById(id);

    if (email) {
      const existingUser = await this.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new createHttpError.Conflict(
          'Email already in use by another user',
        );
      }
      user.email = email;
    }

    if (password) {
      user.password = await this.hashPassword(password);
    }

    await user.save();

    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    await user.destroy();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

export const usersService = new UsersService();
