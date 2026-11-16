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
}
