import { Injectable, BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { GeneratePreset } from './dto/generate-data.dto';

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
    | 'phoneNumber';
  min?: number;
  max?: number;
  length?: number;
  options?: string[];
};

@Injectable()
export class GeneratorService {
  generate(count: number, preset: GeneratePreset = GeneratePreset.USERS) {
    return Array.from({ length: count }, () => {
      switch (preset) {
        case GeneratePreset.PRODUCTS:
          return {
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
            category: faker.commerce.department(),
            price: Number(faker.commerce.price()),
          };

        case GeneratePreset.UMAMUSUME:
          return {
            id: faker.string.uuid(),
            name: faker.helpers.arrayElement([
              'Agnes Digital',
              'Silence Suzuka',
              'Haru Urara',
              'Mr. C.B',
              'Nice Nature',
              'Fuji Kiseki',
              'Ikuno Dictus',
              'Maruzensky',
              'Mejiro Dober',
              'Transcend',
              'King Halo',
              'Grass Wonder',
              'Seiun Sky',
              'Seeking The Pearl',
              'Meisho Doto',
              'T.M Cristiano Ronaldo O',
            ]),
            speed: faker.number.int({ min: 100, max: 1600 }),
            stamina: faker.number.int({ min: 100, max: 1300 }),
            power: faker.number.int({ min: 100, max: 1400 }),
            guts: faker.number.int({ min: 100, max: 1400 }),
            wit: faker.number.int({ min: 100, max: 1300 }),
          };

        case GeneratePreset.EMPLOYEES:
          return {
            id: faker.string.uuid(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            jobTitle: faker.person.jobTitle(),
            department: faker.commerce.department(),
          };

        default:
          return {
            id: faker.string.uuid(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
          };
      }
    });
  }
  generateCustom(count: number, fields: CustomField[]) {
    const names = fields.map((field) => field.name.trim().toLowerCase());

    if (new Set(names).size !== names.length) {
      throw new BadRequestException('Field names must be unique.');
    }
    const hasInvalidRange = fields.some((field) => {
      if (field.type !== 'number') return false;

      const min = field.min ?? 1;
      const max = field.max ?? 100;

      return (
        !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max
      );
    });

    if (hasInvalidRange) {
      throw new BadRequestException('Invalid number range.');
    }
    const records: Record<string, string | number>[] = [];

    const hasInvalidOptions = fields.some((field) => {
      if (field.type !== 'choice') return false;

      if (!field.options || field.options.length === 0) {
        return true;
      }

      return field.options.some((option) => option.trim() === '');
    });

    if (hasInvalidOptions) {
      throw new BadRequestException('Invalid choice options.');
    }

    for (let i = 0; i < count; i++) {
      const record: Record<string, string | number> = {};

      for (const field of fields) {
        if (field.type === 'personName') {
          record[field.name] = faker.person.fullName();
        } else if (field.type === 'productName') {
          record[field.name] = faker.commerce.productName();
        }
        if (field.type === 'companyName') {
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
        }
      }

      records.push(record);
    }

    return records;
  }
}
