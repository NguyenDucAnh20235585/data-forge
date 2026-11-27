import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { GeneratorService } from './generator.service';
import { GenerateDataDto } from './dto/generate-data.dto';
import { GenerateCustomDto } from './dto/generate-custom.dto';
import { writeNdjson } from './write-ndjson';

@Controller('generate')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Get('epl/season')
  getEplSeason(@Query('locale') locale = 'en') {
    if (locale !== 'en' && locale !== 'vi' && locale !== 'ja') {
      throw new BadRequestException('Unsupported locale.');
    }

    return this.generatorService.getEplSeason(locale);
  }

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

  @Post('quick/stream')
  @HttpCode(200)
  async generateQuickStream(
    @Body() body: GenerateDataDto,
    @Res() res: Response,
  ) {
    const batches = this.generatorService.generateQuickBatches(
      body.count,
      body.preset,
      body.locale ?? 'en',
    );

    await writeNdjson(res, batches, body.count);
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
    await writeNdjson(res, batches, body.count);
  }
}
