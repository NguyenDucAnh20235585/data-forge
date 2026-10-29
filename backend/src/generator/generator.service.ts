import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { GeneratePreset } from './dto/generate-data.dto';

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
}
