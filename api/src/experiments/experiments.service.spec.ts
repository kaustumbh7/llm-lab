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
      ],
    }).compile();

    service = module.get<ExperimentsService>(ExperimentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
