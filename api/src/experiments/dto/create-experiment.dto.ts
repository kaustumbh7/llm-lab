import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateExperimentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  prompt: string;

  // Temperature parameters
  @IsNumber()
  @Min(0)
  @Max(2)
  temperatureMin: number;

  @IsNumber()
  @Min(0)
  @Max(2)
  temperatureMax: number;

  // Top-P parameters
  @IsNumber()
  @Min(0)
  @Max(1)
  topPMin: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  topPMax: number;

  // Top-K parameters
  @IsNumber()
  @Min(1)
  @Max(100)
  topKMin: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  topKMax: number;

  // Max Tokens parameters
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokensMin: number;

  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokensMax: number;
}
