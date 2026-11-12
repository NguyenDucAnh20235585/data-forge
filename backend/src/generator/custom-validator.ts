import { BadRequestException } from '@nestjs/common';

export function validateFieldNames(fields: { name: string }[]): void {
  const names = fields.map((field) => field.name.trim().toLowerCase());

  if (new Set(names).size !== names.length) {
    throw new BadRequestException('Field names must be unique.');
  }
}

export function validateNumberRanges(
  fields: { type: string; min?: number; max?: number }[],
): void {
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
}

export function validateChoiceOptions(
  fields: { type: string; options?: string[] }[],
): void {
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
}

export function validateDateRanges(
  fields: {
    type: string;
    startDate?: string;
    endDate?: string;
  }[],
): void {
  const hasInvalidDateRange = fields.some((field) => {
    if (field.type !== 'date') return false;

    if (!field.startDate || !field.endDate) {
      return true;
    }

    const start = new Date(field.startDate);
    const end = new Date(field.endDate);

    return (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start.getTime() > end.getTime()
    );
  });

  if (hasInvalidDateRange) {
    throw new BadRequestException('Invalid date range.');
  }
}

export function validatePatterns(
  fields: { type: string; pattern?: string }[],
): void {
  const hasInvalidPattern = fields.some((field) => {
    if (field.type !== 'pattern') return false;

    return !field.pattern || field.pattern.trim() === '';
  });

  if (hasInvalidPattern) {
    throw new BadRequestException('Invalid pattern.');
  }
}
