import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { CreateExperimentDto } from './dto/create-experiment.dto';
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

  @Get(':id/export')
  async exportExperiment(@Param('id') id: string, @Res() res: Response) {
    const exportData = await this.experimentsService.exportExperiment(id);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="experiment-${id}.json"`,
    );
    res.json(exportData);
  }
}
