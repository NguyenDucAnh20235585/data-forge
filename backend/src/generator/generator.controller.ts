import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GeneratorService } from './generator.service';
import { GenerateDataDto } from './dto/generate-data.dto';
import { GenerateCustomDto } from './dto/generate-custom.dto';

@Controller('generate')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  generate(@Body() body: GenerateDataDto) {
    return this.generatorService.generate(
      body.count,
      body.preset,
      body.locale ?? 'en',
    );
  }

  @Post('custom')
  generateCustom(@Body() body: GenerateCustomDto) {
    return this.generatorService.generateCustom(
      body.count,
      body.fields,
      body.locale ?? 'en',
    );
  }

  @Post('stream-demo')
  @HttpCode(200)
  async streamDemo(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');

    for (let completed = 1; completed <= 3; completed++) {
      if (res.destroyed) return;

      res.write(
        JSON.stringify({
          type: 'progress',
          completed,
          total: 3,
        }) + '\n',
      );

      if (completed < 3) {
        await new Promise<void>((resolve) => setTimeout(resolve, 700));
      }
    }

    res.end();
  }

  @Post('custom/stream')
  @HttpCode(200)
  async generateCustomStream(
    @Body() body: GenerateCustomDto,
    @Res() res: Response,
  ) {
    const batches = this.generatorService.generateCustomBatches(
      body.count,
      body.fields,
      body.locale ?? 'en',
    );
    let next = batches.next();

    const maxBytes = 2 * 1024 * 1024;
    const total = body.count;

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
}
