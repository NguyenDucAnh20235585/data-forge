import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { GeneratePreset } from './dto/generate-data.dto';

jest.mock('./generator.service', () => ({
  GeneratorService: jest.fn(),
}));

describe('GeneratorController', () => {
  let controller: GeneratorController;

  const serviceMock = {
    generate: jest.fn(),
    generateCustom: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorController],
      providers: [
        {
          provide: GeneratorService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<GeneratorController>(GeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('forwards quick generation arguments', () => {
    controller.generate({
      count: 2,
      preset: GeneratePreset.USERS,
    });

    expect(serviceMock.generate).toHaveBeenCalledWith(
      2,
      GeneratePreset.USERS,
      'en',
    );
  });

  it('forwards custom generation arguments', () => {
    const fields = [{ name: 'active', type: 'boolean' as const }];

    controller.generateCustom({
      count: 2,
      fields,
      locale: 'vi',
    });

    expect(serviceMock.generateCustom).toHaveBeenCalledWith(2, fields, 'vi');
  });
});
