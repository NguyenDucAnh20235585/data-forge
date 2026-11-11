import { Type } from 'class-transformer';
import type { DataLocale } from '../faker-locale';
import {
  IsArray,
  ArrayMinSize,
  IsIn,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
  Matches,
  IsOptional,
  IsDateString,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';

export class CustomFieldDto {
  @IsString()
  @MaxLength(64)
  @Matches(/\S/, {
    message: 'Field name cannot be empty.',
  })
  name!: string;

  @IsOptional()
  @IsInt()
  min?: number;

  @IsOptional()
  @IsInt()
  max?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  length?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  options?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(/\S/, {
    message: 'Pattern cannot be empty.',
  })
  pattern?: string;

  @IsIn([
    'personName',
    'productName',
    'companyName',
    'number',
    'email',
    'string',
    'choice',
    'phoneNumber',
    'date',
    'pattern',
    'firstName',
    'lastName',
    'city',
    'country',
    'url',
    'ipv4',
    'uuid',
    'boolean',
  ])
  type!:
    | 'personName'
    | 'productName'
    | 'companyName'
    | 'number'
    | 'email'
    | 'string'
    | 'choice'
    | 'phoneNumber'
    | 'date'
    | 'pattern'
    | 'firstName'
    | 'lastName'
    | 'city'
    | 'country'
    | 'url'
    | 'ipv4'
    | 'uuid'
    | 'boolean';
}

export class GenerateCustomDto {
  @IsInt()
  @Min(1)
  @Max(1000)
  count!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDto)
  fields!: CustomFieldDto[];

  @IsOptional()
  @IsIn(['en', 'vi', 'ja'])
  locale?: DataLocale;
}
