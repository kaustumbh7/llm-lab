import { Injectable, Logger } from '@nestjs/common';

import { LLMParameters, LlmService } from '../llm/llm.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { ExperimentParameters } from './types/experiment-parameters.type';

@Injectable()
export class ExperimentsService {
  private readonly logger = new Logger(ExperimentsService.name);

  constructor(
    private prisma: PrismaService,
    private llmService: LlmService,
  ) {}

  async createExperiment(dto: CreateExperimentDto) {
    const experiment = await this.prisma.experiment.create({
      data: {
        name: dto.name,
        description: dto.description,
        prompt: dto.prompt,
        temperatureMin: dto.temperatureMin,
        temperatureMax: dto.temperatureMax,
        temperatureStep: dto.temperatureStep || 0.1,
        topPMin: dto.topPMin,
        topPMax: dto.topPMax,
        topPStep: dto.topPStep || 0.1,
        topKMin: dto.topKMin,
        topKMax: dto.topKMax,
        topKStep: dto.topKStep || 5,
        maxTokensMin: dto.maxTokensMin,
        maxTokensMax: dto.maxTokensMax,
        maxTokensStep: dto.maxTokensStep || 100,
        model: dto.model || 'gemini-2.5-flash',
      },
    });

    this.logger.log(`Created experiment: ${experiment.id}`);
    return experiment;
  }

  async getExperiments() {
    return this.prisma.experiment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        responses: true,
      },
    });
  }

  async getExperiment(id: string) {
    return this.prisma.experiment.findUnique({
      where: { id },
      include: {
        responses: true,
      },
    });
  }

  generateParameterCombinations(
    experiment: ExperimentParameters,
  ): LLMParameters[] {
    const combinations: LLMParameters[] = [];

    const temperatureSteps = Math.ceil(
      (experiment.temperatureMax - experiment.temperatureMin) /
        experiment.temperatureStep,
    );
    const topPSteps = Math.ceil(
      (experiment.topPMax - experiment.topPMin) / experiment.topPStep,
    );
    const topKSteps = Math.ceil(
      (experiment.topKMax - experiment.topKMin) / experiment.topKStep,
    );
    const maxTokensSteps = Math.ceil(
      (experiment.maxTokensMax - experiment.maxTokensMin) /
        experiment.maxTokensStep,
    );

    for (let t = 0; t <= temperatureSteps; t++) {
      for (let p = 0; p <= topPSteps; p++) {
        for (let k = 0; k <= topKSteps; k++) {
          for (let m = 0; m <= maxTokensSteps; m++) {
            const temperature = Math.min(
              experiment.temperatureMin + t * experiment.temperatureStep,
              experiment.temperatureMax,
            );
            const topP = Math.min(
              experiment.topPMin + p * experiment.topPStep,
              experiment.topPMax,
            );
            const topK = Math.min(
              experiment.topKMin + k * experiment.topKStep,
              experiment.topKMax,
            );
            const maxTokens = Math.min(
              experiment.maxTokensMin + m * experiment.maxTokensStep,
              experiment.maxTokensMax,
            );

            combinations.push({
              temperature: Math.round(temperature * 100) / 100,
              topP: Math.round(topP * 100) / 100,
              topK: Math.round(topK),
              maxTokens: Math.round(maxTokens),
              model: experiment.model,
            });
          }
        }
      }
    }

    return combinations;
  }

  async runExperiment(experimentId: string, maxResponses: number = 20) {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    const parameterCombinations =
      this.generateParameterCombinations(experiment);
    const limitedCombinations = parameterCombinations.slice(0, maxResponses);

    this.logger.log(
      `Running experiment with ${limitedCombinations.length} parameter combinations`,
    );

    const savedResponses: any[] = [];
    for (const params of limitedCombinations) {
      const response = await this.llmService.generateResponse(
        experiment.prompt,
        params,
      );

      const savedResponse = await this.prisma.response.create({
        data: {
          experimentId: experiment.id,
          temperature: params.temperature,
          topP: params.topP,
          topK: params.topK,
          maxTokens: params.maxTokens,
          content: response.content,
        },
      });

      savedResponses.push(savedResponse);
    }

    this.logger.log(
      `Generated ${savedResponses.length} responses for experiment ${experiment.id}`,
    );

    return {
      experiment,
      responsesGenerated: savedResponses.length,
      parameterCombinations: limitedCombinations.length,
    };
  }
}
