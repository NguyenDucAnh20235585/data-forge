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

  it('rejects excessive generation workload', () => {
    const fields = Array.from({ length: 50 }, (_, index) => ({
      name: `field${index}`,
      type: 'number' as const,
      min: 1,
      max: 100,
    }));

    expect(() => service.generateCustom(401, fields)).toThrow(
      'Generation request is too large.',
    );
  });

  it('allows generation at the workload limit', () => {
    const fields = Array.from({ length: 50 }, (_, index) => ({
      name: `field${index}`,
      type: 'number' as const,
      min: 1,
      max: 100,
    }));

    const records = service.generateCustom(400, fields);

    expect(records).toHaveLength(400);
    expect(Object.keys(records[0])).toHaveLength(50);
  });

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
