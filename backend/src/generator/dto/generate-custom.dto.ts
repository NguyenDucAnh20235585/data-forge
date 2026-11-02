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

  @IsIn(['personName', 'number', 'email', 'string'])
  type!: 'personName' | 'number' | 'email' | 'string';
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
