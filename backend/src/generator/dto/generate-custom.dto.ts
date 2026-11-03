import { Type } from 'class-transformer';
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
} from 'class-validator';

export class CustomFieldDto {
  @IsString()
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
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

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
    | 'date';
}

export class GenerateCustomDto {
  @IsInt()
  @Min(1)
  @Max(1000)
  count!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDto)
  fields!: CustomFieldDto[];
}
