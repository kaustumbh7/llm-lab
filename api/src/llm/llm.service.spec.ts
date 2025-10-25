import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LlmService } from './llm.service';
import { RateLimiterService } from './rate-limiter.service';

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
        {
          provide: RateLimiterService,
          useValue: {
            acquireToken: jest.fn().mockResolvedValue(undefined),
            getStatus: jest.fn().mockReturnValue({
              tokens: 2,
              queueLength: 0,
              maxRequestsPerMinute: 15,
              maxBurstRequests: 2,
              minTimeBetweenRequests: 1000,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
