import { IsInt, Min, Max } from 'class-validator';

export class GenerateDataDto {
  @IsInt()
  @Min(1)
  @Max(1000)
  count!: number;
}
