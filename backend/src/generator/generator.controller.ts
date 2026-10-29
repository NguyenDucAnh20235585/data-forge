import { Body, Controller, Post } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GenerateDataDto } from './dto/generate-data.dto';

@Controller('generate')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  generate(@Body() body: GenerateDataDto) {
    return this.generatorService.generate(body.count);
  }
}
