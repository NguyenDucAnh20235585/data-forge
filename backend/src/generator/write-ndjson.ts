import type { Response } from 'express';
import { MAX_STREAM_BYTES } from './generatorLimits';

export async function writeNdjson(
  res: Response,
  batches: Generator<readonly unknown[]>,
  total: number,
): Promise<void> {
  let next = batches.next();

  const maxBytes = MAX_STREAM_BYTES;

  const doneLine =
    JSON.stringify({ type: 'done', completed: total, total }) + '\n';

  const limitErrorLine =
    JSON.stringify({
      type: 'error',
      message: 'Response size limit exceeded.',
    }) + '\n';

  const runtimeErrorLine =
    JSON.stringify({
      type: 'error',
      message: 'Stream interrupted.',
    }) + '\n';

  const reservedBytes = Math.max(
    Buffer.byteLength(doneLine, 'utf8'),
    Buffer.byteLength(limitErrorLine, 'utf8'),
    Buffer.byteLength(runtimeErrorLine, 'utf8'),
  );

  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');

  let completed = 0;
  let sentBytes = 0;

  try {
    while (!next.done) {
      if (res.destroyed) return;

      const batch = next.value;
      const newCompleted = completed + batch.length;

      const line =
        JSON.stringify({
          type: 'batch',
          records: batch,
          completed: newCompleted,
          total,
        }) + '\n';

      const bytes = Buffer.byteLength(line, 'utf8');

      if (sentBytes + bytes + reservedBytes > maxBytes) {
        res.end(limitErrorLine);
        return;
      }

      const canContinue = res.write(line);
      sentBytes += bytes;
      completed = newCompleted;
      if (!canContinue && !res.destroyed) {
        await new Promise<void>((resolve) => {
          const finish = () => {
            res.off('drain', finish);
            res.off('close', finish);
            resolve();
          };

          res.once('drain', finish);
          res.once('close', finish);
        });
      }

      if (res.destroyed) return;

      await new Promise<void>((resolve) => setImmediate(resolve));

      if (res.destroyed) return;
      next = batches.next();
    }

    if (!res.destroyed) {
      res.end(doneLine);
    }
  } catch {
    if (!res.destroyed) {
      res.end(runtimeErrorLine);
    }
  }
}
