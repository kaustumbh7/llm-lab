import { Module } from '@nestjs/common';

import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { RateLimiterService } from './rate-limiter.service';

@Module({
  providers: [LlmService, RateLimiterService],
  exports: [LlmService, RateLimiterService],
  controllers: [LlmController],
})
export class LlmModule {}
