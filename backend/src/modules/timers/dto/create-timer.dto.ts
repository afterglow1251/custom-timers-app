import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateTimerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  exerciseTime: number;

  @IsInt()
  @Min(0)
  restTime: number;

  @IsInt()
  @Min(1)
  rounds: number;
}
