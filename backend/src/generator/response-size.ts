import { BadRequestException } from '@nestjs/common';

import { MAX_RESPONSE_BYTES } from './generatorLimits';

export function ensureResponseSize(records: readonly unknown[]): void {
  const json = JSON.stringify(records);
  const bytes = Buffer.byteLength(json, 'utf8');

  if (bytes > MAX_RESPONSE_BYTES) {
    throw new BadRequestException('Generated response exceeds 2 MiB.');
  }
}
