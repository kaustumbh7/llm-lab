import { Injectable, Logger } from '@nestjs/common';
import { Experiment, Response } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_METRIC_WEIGHTS, MetricsResult } from './types/metric-types';
import { CoherenceUtil } from './utils/coherence.util';
import { CompletenessUtil } from './utils/completeness.util';
import { LengthUtil } from './utils/length.util';
import { StructureUtil } from './utils/structure.util';
import { TextAnalysisUtil } from './utils/text-analysis.util';
import { VocabularyUtil } from './utils/vocabulary.util';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private prisma: PrismaService) {}

  async calculateMetrics(
    response: Response,
    experiment: Experiment,
  ): Promise<MetricsResult> {
    const content = response.content;
    const prompt = experiment.prompt;

    // Calculate all metrics using utility classes
    const coherenceScore = CoherenceUtil.calculateCoherenceScore(content);
    const completenessScore = CompletenessUtil.calculateCompletenessScore(
      content,
      prompt,
    );
    const lengthScore = LengthUtil.calculateLengthScore(content, prompt);
    const structureScore = StructureUtil.calculateStructureScore(content);
    const vocabularyScore = VocabularyUtil.calculateVocabularyScore(content);

    // Calculate text analysis metrics
    const textAnalysis = TextAnalysisUtil.analyzeText(content);

    // Calculate overall score
    const overallScore = this.calculateOverallScore({
      coherenceScore,
      completenessScore,
      lengthScore,
      structureScore,
      vocabularyScore,
    });

    const result: MetricsResult = {
      coherenceScore,
      completenessScore,
      lengthScore,
      structureScore,
      vocabularyScore,
      overallScore,
      ...textAnalysis,
    };

    // Save metrics to database
    await this.prisma.responseMetrics.upsert({
      where: { responseId: response.id },
      update: result,
      create: {
        responseId: response.id,
        ...result,
      },
    });

    this.logger.log(`Calculated metrics for response ${response.id}`);
    return result;
  }

  private calculateOverallScore(metrics: {
    coherenceScore: number;
    completenessScore: number;
    lengthScore: number;
    structureScore: number;
    vocabularyScore: number;
  }): number {
    return (
      metrics.coherenceScore * DEFAULT_METRIC_WEIGHTS.coherence +
      metrics.completenessScore * DEFAULT_METRIC_WEIGHTS.completeness +
      metrics.lengthScore * DEFAULT_METRIC_WEIGHTS.length +
      metrics.structureScore * DEFAULT_METRIC_WEIGHTS.structure +
      metrics.vocabularyScore * DEFAULT_METRIC_WEIGHTS.vocabulary
    );
  }
}
