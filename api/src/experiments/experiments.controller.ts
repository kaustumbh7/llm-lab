import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import type { CreateExperimentDto } from './dto/create-experiment.dto';
import { ExperimentsService } from './experiments.service';

@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Post()
  create(@Body() createExperimentDto: CreateExperimentDto) {
    return this.experimentsService.createExperiment(createExperimentDto);
  }

  @Get()
  findAll() {
    return this.experimentsService.getExperiments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentsService.getExperiment(id);
  }

  @Post(':id/run')
  run(@Param('id') id: string) {
    return this.experimentsService.runExperiment(id);
  }
}
