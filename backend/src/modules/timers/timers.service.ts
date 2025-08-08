import createHttpError from 'http-errors';
import { Timer } from '../database/models/Timer';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { CreateTimerDto } from './dto/create-timer.dto';

export class TimersService {
  async getAllByUser(userId: number): Promise<Timer[]> {
    return Timer.findAll({ where: { userId } });
  }

  async getById(id: number, userId: number): Promise<Timer> {
    const timer = await Timer.findOne({ where: { id, userId } });
    if (!timer) {
      throw new createHttpError.NotFound('Timer not found');
    }
    return timer;
  }

  async create(userId: number, data: CreateTimerDto): Promise<Timer> {
    return Timer.create({ ...data, userId });
  }

  async update(
    id: number,
    userId: number,
    data: UpdateTimerDto,
  ): Promise<Timer> {
    const timer = await this.getById(id, userId);
    await timer.update(data);
    return timer;
  }

  async delete(id: number, userId: number): Promise<void> {
    const timer = await this.getById(id, userId);
    await timer.destroy();
  }
}

export const timersService = new TimersService();
