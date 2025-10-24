import { Module } from '@nestjs/common';

import { ExperimentsController } from './experiments.controller';
import { ExperimentsService } from './experiments.service';

@Module({
  providers: [ExperimentsService],
  controllers: [ExperimentsController],
})
export class ExperimentsModule {}
