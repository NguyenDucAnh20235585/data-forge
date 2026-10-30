import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { GeneratePreset } from './dto/generate-data.dto';

type CustomField = {
  name: string;
  type: 'personName' | 'number';
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
    const records: Record<string, string | number>[] = [];

    for (let i = 0; i < count; i++) {
      const record: Record<string, string | number> = {
        id: faker.string.uuid(),
      };

      for (const field of fields) {
        if (field.type === 'personName') {
          record[field.name] = faker.person.fullName();
        } else if (field.type === 'number') {
          record[field.name] = faker.number.int({ min: 1, max: 100 });
        }
      }

      records.push(record);
    }

    return records;
  }
}
