import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { MetricsModule } from '../metrics/metrics.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ExperimentsController } from './experiments.controller';
import { ExperimentsService } from './experiments.service';

@Module({
  imports: [PrismaModule, LlmModule, MetricsModule],
  providers: [ExperimentsService],
  controllers: [ExperimentsController],
  exports: [ExperimentsService],
})
export class ExperimentsModule {}
