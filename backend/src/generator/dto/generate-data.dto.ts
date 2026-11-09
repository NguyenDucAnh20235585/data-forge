import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import type { DataLocale } from '../faker-locale';

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

  @IsOptional()
  @IsIn(['en', 'vi', 'ja'])
  locale?: DataLocale;
}
