import { IsString, IsOptional, IsInt, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHintDto {
  @IsInt()
  @Min(1)
  @Max(5)
  hintNumber!: number;

  @IsString()
  text!: string;

  @IsInt()
  @Min(0)
  @Max(60)
  penaltyPercent!: number;
}

export class CreateRiddleDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsString()
  question!: string;

  @IsString()
  @MaxLength(200)
  answer!: string;

  @IsString()
  explanation!: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @Type(() => CreateHintDto)
  hints?: CreateHintDto[];
}

export class UpdateRiddleDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  answer?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @Type(() => CreateHintDto)
  hints?: CreateHintDto[];
}

export class RateRiddleDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  perceivedDifficulty?: string;
}

export class QueryRiddlesDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}
