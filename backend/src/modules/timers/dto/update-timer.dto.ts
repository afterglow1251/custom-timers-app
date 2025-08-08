import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateTimerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  exerciseTime?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  restTime?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  rounds?: number;
}
