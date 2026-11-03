import { Injectable, BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { GeneratePreset } from './dto/generate-data.dto';
import { generatePreset } from './preset-generator';

import {
  validateFieldNames,
  validateNumberRanges,
  validateChoiceOptions,
  validateDateRanges,
  validatePatterns,
} from './custom-validator';

type CustomField = {
  name: string;
  type:
    | 'personName'
    | 'productName'
    | 'companyName'
    | 'number'
    | 'email'
    | 'string'
    | 'choice'
    | 'phoneNumber'
    | 'date'
    | 'pattern';
  min?: number;
  max?: number;
  length?: number;
  options?: string[];
  startDate?: string;
  endDate?: string;
  pattern?: string;
};

@Injectable()
export class GeneratorService {
  generate(count: number, preset: GeneratePreset = GeneratePreset.USERS) {
    return generatePreset(count, preset);
  }
  generateCustom(count: number, fields: CustomField[]) {
    validateFieldNames(fields);
    validateNumberRanges(fields);
    validateChoiceOptions(fields);
    validateDateRanges(fields);
    validatePatterns(fields);

    const records: Record<string, string | number>[] = [];

    for (let i = 0; i < count; i++) {
      const record: Record<string, string | number> = {};

      for (const field of fields) {
        if (field.type === 'personName') {
          record[field.name] = faker.person.fullName();
        } else if (field.type === 'productName') {
          record[field.name] = faker.commerce.productName();
        } else if (field.type === 'companyName') {
          record[field.name] = faker.company.name();
        } else if (field.type === 'number') {
          record[field.name] = faker.number.int({
            min: field.min ?? 1,
            max: field.max ?? 100,
          });
        } else if (field.type === 'email') {
          record[field.name] = faker.internet.email();
        } else if (field.type === 'string') {
          record[field.name] = faker.string.alphanumeric({
            length: field.length ?? 8,
          });
        } else if (field.type === 'choice') {
          if (!field.options) {
            throw new BadRequestException('Invalid choice options.');
          }

          record[field.name] = faker.helpers.arrayElement(field.options);
        } else if (field.type === 'phoneNumber') {
          record[field.name] = faker.phone.number();
        } else if (field.type === 'date') {
          if (!field.startDate || !field.endDate) {
            throw new BadRequestException('Invalid date range.');
          }

          record[field.name] = faker.date
            .between({
              from: field.startDate,
              to: field.endDate,
            })
            .toISOString()
            .slice(0, 10);
        }
      }

      records.push(record);
    }

    return records;
  }
}
