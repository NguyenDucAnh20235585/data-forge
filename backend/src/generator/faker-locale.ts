import { fakerEN, fakerVI, fakerJA } from '@faker-js/faker';

const fakerByLocale = {
  en: fakerEN,
  vi: fakerVI,
  ja: fakerJA,
};

export type DataLocale = keyof typeof fakerByLocale;

export function getFaker(locale: DataLocale) {
  return fakerByLocale[locale];
}
