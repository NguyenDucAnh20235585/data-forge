import { BadRequestException } from '@nestjs/common';
import { ensureResponseSize } from './response-size';

describe('Response size limit', () => {
  const limit = 2 * 1024 * 1024;

  it('allows JSON exactly at the limit', () => {
    const records = ['a'.repeat(limit - 4)];

    expect(() => ensureResponseSize(records)).not.toThrow();
  });

  it('rejects JSON exceeding the limit', () => {
    const records = ['a'.repeat(limit - 3)];

    expect(() => ensureResponseSize(records)).toThrow(BadRequestException);
  });
});
