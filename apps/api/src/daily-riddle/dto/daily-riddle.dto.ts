import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class SetDailyRiddleDto {
  @IsString()
  riddleId!: string;

  @IsString()
  date!: string;

  @IsOptional()
  @IsNumber()
  @Min(1.0)
  bonusMultiplier?: number;
}
