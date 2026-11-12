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

const API_ROUTES = [
  { method: 'GET', endpoint: '/api/users', successStatus: 200 },
  { method: 'GET', endpoint: '/api/products', successStatus: 200 },
  { method: 'GET', endpoint: '/api/orders', successStatus: 200 },
  { method: 'GET', endpoint: '/api/health', successStatus: 200 },
  { method: 'POST', endpoint: '/api/orders', successStatus: 201 },
  { method: 'POST', endpoint: '/api/auth/login', successStatus: 200 },
  { method: 'PATCH', endpoint: '/api/users/me', successStatus: 200 },
];

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

      case GeneratePreset.ORDERS: {
        const product = faker.helpers.arrayElement(PRODUCT_CATALOG);
        const color = faker.helpers.arrayElement(COLOR_VARIANTS);

        const quantity = faker.number.int({ min: 1, max: 5 });
        const unitPrice = product.price[locale];

        const status = faker.helpers.arrayElement([
          'pending',
          'shipped',
          'delivered',
          'delivered',
          'cancelled',
        ]);

        return {
          orderId: faker.string.uuid(),
          customerName: faker.person.fullName(),
          product: `${product.name[locale]} - ${color[locale]}`,
          quantity,
          unitPrice,
          total: quantity * unitPrice,
          currency: CURRENCY_BY_LOCALE[locale],
          status,
          createdAt: faker.date.recent({ days: 90 }).toISOString(),
        };
      }
      case GeneratePreset.API_LOGS: {
        const route = faker.helpers.arrayElement(API_ROUTES);

        const isSuccess =
          faker.number.int({
            min: 1,
            max: 100,
          }) <= 80;

        const statusCode = isSuccess
          ? route.successStatus
          : faker.helpers.arrayElement([400, 401, 403, 404, 429, 500]);

        const responseTimeMs = faker.number.int({
          min: statusCode >= 500 ? 500 : 20,
          max: statusCode >= 500 ? 3000 : 800,
        });

        return {
          timestamp: faker.date.recent({ days: 7 }).toISOString(),
          method: route.method,
          endpoint: route.endpoint,
          ipAddress: faker.internet.ipv4(),
          statusCode,
          responseTimeMs,
        };
      }

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
