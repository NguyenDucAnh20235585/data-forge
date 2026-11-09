import { GeneratePreset } from './dto/generate-data.dto';
import { getFaker, type DataLocale } from './faker-locale';
import { UMAMUSUME_NAMES } from './umamusume-names';

export function generatePreset(
  count: number,
  preset: GeneratePreset,
  locale: DataLocale = 'en',
) {
  const faker = getFaker(locale);

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
          name: faker.helpers.arrayElement(UMAMUSUME_NAMES),
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
