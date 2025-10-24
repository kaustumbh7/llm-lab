import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class RunExperimentDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxResponses?: number;
}
