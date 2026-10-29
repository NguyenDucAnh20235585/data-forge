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
