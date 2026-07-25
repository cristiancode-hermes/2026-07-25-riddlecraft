import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  answer!: string;
}

export class CreateAttemptDto {
  @IsString()
  riddleId!: string;

  @IsOptional()
  @IsString()
  dailyRiddleId?: string;
}
