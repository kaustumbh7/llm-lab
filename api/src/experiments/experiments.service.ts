import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Experiment, Response } from '@prisma/client';

import { LLMParameters, LlmService } from '../llm/llm.service';
import { MetricsService } from '../metrics/metrics.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';

@Injectable()
export class ExperimentsService {
  private readonly logger = new Logger(ExperimentsService.name);

  constructor(
    private prisma: PrismaService,
    private llmService: LlmService,
    private configService: ConfigService,
    private metricsService: MetricsService,
  ) {}

  async createExperiment(dto: CreateExperimentDto) {
    // Get constants from environment variables
    const temperatureCombinations = this.configService.get<number>(
      'TEMPERATURE_COMBINATIONS',
      2,
    );
    const topPCombinations = this.configService.get<number>(
      'TOP_P_COMBINATIONS',
      2,
    );
    const topKCombinations = this.configService.get<number>(
      'TOP_K_COMBINATIONS',
      2,
    );
    const maxTokensCombinations = this.configService.get<number>(
      'MAX_TOKENS_COMBINATIONS',
      2,
    );

    // Calculate steps dynamically based on our constants
    const temperatureStep =
      (dto.temperatureMax - dto.temperatureMin) / (temperatureCombinations - 1);
    const topPStep = (dto.topPMax - dto.topPMin) / (topPCombinations - 1);
    const topKStep = (dto.topKMax - dto.topKMin) / (topKCombinations - 1);
    const maxTokensStep =
      (dto.maxTokensMax - dto.maxTokensMin) / (maxTokensCombinations - 1);

    const experiment = await this.prisma.experiment.create({
      data: {
        name: dto.name,
        description: dto.description,
        prompt: dto.prompt,
        temperatureMin: dto.temperatureMin,
        temperatureMax: dto.temperatureMax,
        temperatureStep: temperatureStep,
        topPMin: dto.topPMin,
        topPMax: dto.topPMax,
        topPStep: topPStep,
        topKMin: dto.topKMin,
        topKMax: dto.topKMax,
        topKStep: topKStep,
        maxTokensMin: dto.maxTokensMin,
        maxTokensMax: dto.maxTokensMax,
        maxTokensStep: maxTokensStep,
        model:
          dto.model ||
          this.configService.get<string>('DEFAULT_MODEL', 'gemini-2.5-flash'),
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

  async runExperiment(experimentId: string) {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    const parameterCombinations =
      this.generateParameterCombinations(experiment);

    this.logger.log(
      `Running experiment with ${parameterCombinations.length} parameter combinations`,
    );

    const savedResponses: Response[] = [];
    for (const params of parameterCombinations) {
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

      // Calculate metrics for the response
      try {
        await this.metricsService.calculateMetrics(savedResponse, experiment);
        this.logger.log(`Calculated metrics for response ${savedResponse.id}`);
      } catch (error) {
        this.logger.error(
          `Failed to calculate metrics for response ${savedResponse.id}:`,
          error,
        );
      }

      savedResponses.push(savedResponse);
    }

    this.logger.log(
      `Generated ${savedResponses.length} responses for experiment ${experiment.id}`,
    );

    return {
      experiment,
      responsesGenerated: savedResponses.length,
      parameterCombinations: parameterCombinations.length,
    };
  }

  private generateParameterCombinations(
    experiment: Experiment,
  ): LLMParameters[] {
    const combinations: LLMParameters[] = [];

    // Generate combinations using for loops from min to max with steps
    for (
      let temperature = experiment.temperatureMin;
      temperature <= experiment.temperatureMax;
      temperature += experiment.temperatureStep
    ) {
      for (
        let topP = experiment.topPMin;
        topP <= experiment.topPMax;
        topP += experiment.topPStep
      ) {
        for (
          let topK = experiment.topKMin;
          topK <= experiment.topKMax;
          topK += experiment.topKStep
        ) {
          for (
            let maxTokens = experiment.maxTokensMin;
            maxTokens <= experiment.maxTokensMax;
            maxTokens += experiment.maxTokensStep
          ) {
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

  async exportExperiment(experimentId: string) {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    return experiment;
  }
}
