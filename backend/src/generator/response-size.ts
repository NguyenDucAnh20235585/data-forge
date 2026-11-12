import { BadRequestException } from '@nestjs/common';

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

export function ensureResponseSize(records: readonly unknown[]): void {
  const json = JSON.stringify(records);
  const bytes = Buffer.byteLength(json, 'utf8');

  if (bytes > MAX_RESPONSE_BYTES) {
    throw new BadRequestException('Generated response exceeds 2 MiB.');
  }
}
