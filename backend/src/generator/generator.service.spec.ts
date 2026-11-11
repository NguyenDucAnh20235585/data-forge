import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generator.service';

jest.mock('@faker-js/faker', () => {
  const fakerMock = {
    string: {
      alphanumeric: () => 'SAMPLE',
    },
    number: {
      int: () => 1,
    },
  };

  return {
    fakerEN: fakerMock,
    fakerVI: fakerMock,
    fakerJA: fakerMock,
    faker: fakerMock,
  };
});

describe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorService],
    }).compile();

    service = module.get<GeneratorService>(GeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('preserves special field names in generated records', () => {
    const records = service.generateCustom(1, [
      { name: '__proto__', type: 'string' },
      { name: 'constructor', type: 'number', min: 1, max: 1 },
    ]);

    expect(records).toHaveLength(1);
    expect(Object.keys(records[0])).toEqual(['__proto__', 'constructor']);

    expect(typeof records[0]['__proto__']).toBe('string');
    expect(records[0]['constructor']).toBe(1);

    const json = JSON.stringify(records);

    expect(json).toContain('"__proto__":');
    expect(json).toContain('"constructor":1');
  });
});
