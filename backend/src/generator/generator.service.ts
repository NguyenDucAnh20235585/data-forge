import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

@Injectable()
export class GeneratorService {
  generate(count: number) {
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    }));
  }
}
