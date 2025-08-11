export interface CreateTimerDto {
  name: string;
  exerciseTime: number;
  restTime: number;
  rounds: number;
}

export interface UpdateTimerDto {
  name?: string;
  exerciseTime?: number;
  restTime?: number;
  rounds?: number;
}
