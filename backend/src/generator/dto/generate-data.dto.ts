import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum GeneratePreset {
  USERS = 'users',
  PRODUCTS = 'products',
  EMPLOYEES = 'employees',
  UMAMUSUME = 'umamusume',
}

export class GenerateDataDto {
  @IsInt()
  @Min(1)
  @Max(1000)
  count!: number;

  @IsOptional()
  @IsEnum(GeneratePreset)
  preset?: GeneratePreset;
}
