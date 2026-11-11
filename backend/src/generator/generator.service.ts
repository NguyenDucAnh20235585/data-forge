import { Injectable, BadRequestException } from '@nestjs/common';
import { getFaker, type DataLocale } from './faker-locale';
import { GeneratePreset } from './dto/generate-data.dto';
import { generatePreset } from './preset-generator';
import { generatePattern } from './pattern-generator';

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
    | 'pattern'
    | 'firstName'
    | 'lastName'
    | 'city'
    | 'country'
    | 'url'
    | 'ipv4'
    | 'uuid'
    | 'boolean';
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
  generate(
    count: number,
    preset: GeneratePreset = GeneratePreset.USERS,
    locale: DataLocale = 'en',
  ) {
    return generatePreset(count, preset, locale);
  }

  generateCustom(
    count: number,
    fields: CustomField[],
    locale: DataLocale = 'en',
  ) {
    if (fields.length > 50 || count * fields.length > 20_000) {
      throw new BadRequestException('Generation request is too large.');
    }
    const faker = getFaker(locale);
    validateFieldNames(fields);
    validateNumberRanges(fields);
    validateChoiceOptions(fields);
    validateDateRanges(fields);
    validatePatterns(fields);

    const records: Record<string, string | number | boolean>[] = [];

    for (let i = 0; i < count; i++) {
      const record = Object.create(null) as Record<
        string,
        string | number | boolean
      >;

      for (const field of fields) {
        if (field.type === 'personName') {
          record[field.name] = faker.person.fullName();
        } else if (field.type === 'firstName') {
          record[field.name] = faker.person.firstName();
        } else if (field.type === 'lastName') {
          record[field.name] = faker.person.lastName();
        } else if (field.type === 'city') {
          record[field.name] = faker.location.city();
        } else if (field.type === 'country') {
          record[field.name] = faker.location.country();
        } else if (field.type === 'url') {
          record[field.name] = faker.internet.url();
        } else if (field.type === 'ipv4') {
          record[field.name] = faker.internet.ipv4();
        } else if (field.type === 'uuid') {
          record[field.name] = faker.string.uuid();
        } else if (field.type === 'boolean') {
          record[field.name] = faker.datatype.boolean();
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
        } else if (field.type === 'pattern') {
          if (!field.pattern) {
            throw new BadRequestException('Invalid pattern.');
          }

          record[field.name] = generatePattern(field.pattern);
        }
      }

      records.push(record);
    }

    return records;
  }
}
