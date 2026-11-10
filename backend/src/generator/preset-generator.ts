import { GeneratePreset } from './dto/generate-data.dto';
import { getFaker, type DataLocale } from './faker-locale';
import { UMAMUSUME_NAMES } from './umamusume-names';

import {
  PRODUCT_CATALOG,
  CATEGORY_LABELS,
  COLOR_VARIANTS,
  CURRENCY_BY_LOCALE,
} from './product-catalog';

function getCareerRank(total: number): string {
  if (total >= 6000) return 'UF';
  if (total >= 5000) return 'UG';
  if (total >= 4800) return 'SS+';
  if (total >= 4000) return 'SS';
  if (total >= 3700) return 'S+';
  if (total >= 3000) return 'S';
  if (total >= 2800) return 'A+';
  if (total >= 2400) return 'A';
  if (total >= 2200) return 'B+';
  if (total >= 1800) return 'B';
  if (total >= 1600) return 'C+';
  if (total >= 1000) return 'C';
  if (total >= 700) return 'D+';
  return 'D';
}

export function generatePreset(
  count: number,
  preset: GeneratePreset,
  locale: DataLocale = 'en',
) {
  const faker = getFaker(locale);

  return Array.from({ length: count }, () => {
    switch (preset) {
      case GeneratePreset.PRODUCTS: {
        const product = faker.helpers.arrayElement(PRODUCT_CATALOG);
        const color = faker.helpers.arrayElement(COLOR_VARIANTS);

        return {
          id: faker.string.uuid(),
          name: `${product.name[locale]} - ${color[locale]}`,
          category: CATEGORY_LABELS[product.category][locale],
          price: product.price[locale],
          currency: CURRENCY_BY_LOCALE[locale],
        };
      }

      case GeneratePreset.UMAMUSUME: {
        const stats = {
          speed: faker.number.int({ min: 100, max: 1600 }),
          stamina: faker.number.int({ min: 100, max: 1300 }),
          power: faker.number.int({ min: 100, max: 1400 }),
          guts: faker.number.int({ min: 100, max: 1400 }),
          wit: faker.number.int({ min: 100, max: 1300 }),
        };

        const total = Object.values(stats).reduce(
          (sum, value) => sum + value,
          0,
        );

        return {
          name: faker.helpers.arrayElement(UMAMUSUME_NAMES),
          rank: getCareerRank(total),
          ...stats,
        };
      }

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
