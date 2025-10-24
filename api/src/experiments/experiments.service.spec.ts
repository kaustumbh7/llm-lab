import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LlmService } from '../llm/llm.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExperimentsService } from './experiments.service';

describe('ExperimentsService', () => {
  let service: ExperimentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentsService,
        {
          provide: PrismaService,
          useValue: {
            experiment: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            response: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: LlmService,
          useValue: {
            generateResponse: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockImplementation((key: string, defaultValue?: any): any => {
                const config: Record<string, any> = {
                  TEMPERATURE_COMBINATIONS: 2,
                  TOP_P_COMBINATIONS: 2,
                  TOP_K_COMBINATIONS: 2,
                  MAX_TOKENS_COMBINATIONS: 2,
                  MAX_CONCURRENT_REQUESTS: 3,
                  REQUEST_DELAY_MS: 2000,
                  DEFAULT_MODEL: 'gemini-2.5-flash',
                };
                return config[key] ?? defaultValue;
              }),
          },
        },
      ],
    }).compile();

    service = module.get<ExperimentsService>(ExperimentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
