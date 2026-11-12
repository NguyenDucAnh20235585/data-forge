import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

export function generatePattern(pattern: string): string {
  const result = pattern
    .replace(/\{digits:(\d+)\}/g, (_match, rawLength: string) => {
      const length = Number(rawLength);

      if (!Number.isInteger(length) || length < 1 || length > 100) {
        throw new BadRequestException('Invalid digits length.');
      }

      return faker.string.numeric({ length });
    })
    .replace(/\{letters:(\d+)\}/g, (_match, rawLength: string) => {
      const length = Number(rawLength);

      if (!Number.isInteger(length) || length < 1 || length > 100) {
        throw new BadRequestException('Invalid letters length.');
      }

      return faker.string.alpha({ length }).toUpperCase();
    })
    .replace(/\{choice:([^{}]+)\}/g, (_match, rawOptions: string) => {
      const options = rawOptions.split('|').map((option) => option.trim());

      if (options.length < 2 || options.some((option) => option === '')) {
        throw new BadRequestException('Invalid pattern choice.');
      }

      return faker.helpers.arrayElement(options);
    });
  if (/[{}]/.test(result)) {
    throw new BadRequestException('Invalid or unsupported pattern.');
  }

  return result;
}
