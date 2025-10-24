import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExperimentsModule } from './experiments/experiments.module';
import { LlmModule } from './llm/llm.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LlmModule,
    ExperimentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
