import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

export interface MetricsResult {
  coherenceScore: number;
  completenessScore: number;
  lengthScore: number;
  structureScore: number;
  vocabularyScore: number;
  overallScore: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  uniqueWords: number;
  vocabularyDiversity: number;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private prisma: PrismaService) {}

  async calculateMetrics(responseId: string): Promise<MetricsResult> {
    const response = await this.prisma.response.findUnique({
      where: { id: responseId },
      include: { experiment: true },
    });

    if (!response) {
      throw new Error('Response not found');
    }

    const content = response.content;
    const prompt = response.experiment.prompt;

    // Calculate all metrics
    const coherenceScore = this.calculateCoherenceScore(content);
    const completenessScore = this.calculateCompletenessScore(content, prompt);
    const lengthScore = this.calculateLengthScore(content, prompt);
    const structureScore = this.calculateStructureScore(content);
    const vocabularyScore = this.calculateVocabularyScore(content);

    // Calculate text analysis metrics
    const textAnalysis = this.analyzeText(content);

    // Calculate overall score (weighted average)
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
      where: { responseId },
      update: result,
      create: {
        responseId,
        ...result,
      },
    });

    this.logger.log(`Calculated metrics for response ${responseId}`);
    return result;
  }

  private calculateCoherenceScore(content: string): number {
    if (!content.trim()) return 0;

    const sentences = this.splitIntoSentences(content);
    if (sentences.length < 2) return 0.5;

    let coherenceScore = 0;

    // Check for logical connectors
    const connectors = [
      'however',
      'therefore',
      'furthermore',
      'moreover',
      'additionally',
      'consequently',
      'thus',
      'hence',
      'meanwhile',
      'similarly',
      'on the other hand',
      'in contrast',
      'for example',
      'for instance',
    ];

    const connectorCount = connectors.reduce((count, connector) => {
      return (
        count +
        (content.toLowerCase().match(new RegExp(connector, 'g')) || []).length
      );
    }, 0);

    coherenceScore += Math.min(connectorCount / sentences.length, 0.3);

    // Check for pronoun consistency
    const pronounScore = this.checkPronounConsistency(content);
    coherenceScore += pronounScore * 0.2;

    // Check for topic consistency
    const topicScore = this.checkTopicConsistency(sentences);
    coherenceScore += topicScore * 0.5;

    return Math.min(coherenceScore, 1);
  }

  private calculateCompletenessScore(content: string, prompt: string): number {
    if (!content.trim() || !prompt.trim()) return 0;

    const promptWords = this.extractKeywords(prompt);
    const contentWords = this.extractKeywords(content);

    // Check keyword coverage
    const coveredKeywords = promptWords.filter((keyword) =>
      contentWords.some(
        (word) => word.includes(keyword) || keyword.includes(word),
      ),
    );

    const keywordCoverage =
      coveredKeywords.length / Math.max(promptWords.length, 1);

    // Check for question answering completeness
    const questionScore = this.checkQuestionCompleteness(content, prompt);

    // Check for task fulfillment
    const taskScore = this.checkTaskFulfillment(content, prompt);

    return keywordCoverage * 0.4 + questionScore * 0.3 + taskScore * 0.3;
  }

  private calculateLengthScore(content: string, prompt: string): number {
    if (!content.trim()) return 0;

    const wordCount = content.split(/\s+/).length;
    const promptWordCount = prompt.split(/\s+/).length;

    // Optimal length is 2-5x the prompt length
    const optimalMin = promptWordCount * 2;
    const optimalMax = promptWordCount * 5;

    if (wordCount < optimalMin) {
      return Math.max(wordCount / optimalMin, 0.2);
    } else if (wordCount > optimalMax) {
      return Math.max(optimalMax / wordCount, 0.2);
    } else {
      return 1;
    }
  }

  private calculateStructureScore(content: string): number {
    if (!content.trim()) return 0;

    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());
    const sentences = this.splitIntoSentences(content);

    let structureScore = 0;

    // Check for proper paragraph structure
    if (paragraphs.length > 1) {
      structureScore += 0.3;
    }

    // Check for introduction/body/conclusion structure
    const hasIntroduction = this.hasIntroduction(content);
    const hasConclusion = this.hasConclusion(content);

    if (hasIntroduction) structureScore += 0.2;
    if (hasConclusion) structureScore += 0.2;

    // Check for logical progression
    const progressionScore = this.checkLogicalProgression(sentences);
    structureScore += progressionScore * 0.3;

    return Math.min(structureScore, 1);
  }

  private calculateVocabularyScore(content: string): number {
    if (!content.trim()) return 0;

    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const vocabularyDiversity = uniqueWords.size / words.length;

    // Check for word sophistication
    const sophisticatedWords = words.filter(
      (word) => word.length > 6 && !this.isCommonWord(word),
    );
    const sophisticationScore = sophisticatedWords.length / words.length;

    // Check for repetition
    const repetitionScore = this.calculateRepetitionScore(words);

    return (
      vocabularyDiversity * 0.4 +
      sophisticationScore * 0.3 +
      repetitionScore * 0.3
    );
  }

  private analyzeText(content: string) {
    const words = content.split(/\s+/).filter((word) => word.trim());
    const sentences = this.splitIntoSentences(content);
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence:
        sentences.length > 0 ? words.length / sentences.length : 0,
      uniqueWords: uniqueWords.size,
      vocabularyDiversity:
        words.length > 0 ? uniqueWords.size / words.length : 0,
    };
  }

  private calculateOverallScore(metrics: {
    coherenceScore: number;
    completenessScore: number;
    lengthScore: number;
    structureScore: number;
    vocabularyScore: number;
  }): number {
    // Weighted average with equal weights
    const weights = {
      coherence: 0.2,
      completeness: 0.3,
      length: 0.2,
      structure: 0.15,
      vocabulary: 0.15,
    };

    return (
      metrics.coherenceScore * weights.coherence +
      metrics.completenessScore * weights.completeness +
      metrics.lengthScore * weights.length +
      metrics.structureScore * weights.structure +
      metrics.vocabularyScore * weights.vocabulary
    );
  }

  // Helper methods
  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter((s) => s.trim());
  }

  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter((word) => !this.isCommonWord(word));
  }

  private isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'up',
      'about',
      'into',
      'through',
      'during',
      'before',
      'after',
      'above',
      'below',
      'between',
      'among',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
      'me',
      'him',
      'her',
      'us',
      'them',
    ]);
    return commonWords.has(word.toLowerCase());
  }

  private checkPronounConsistency(content: string): number {
    // Simple pronoun consistency check
    const pronouns = ['he', 'she', 'it', 'they', 'him', 'her', 'them'];
    const pronounCount = pronouns.reduce((count, pronoun) => {
      return (
        count +
        (content.toLowerCase().match(new RegExp(`\\b${pronoun}\\b`, 'g')) || [])
          .length
      );
    }, 0);

    return pronounCount > 0 ? Math.min(pronounCount / 5, 1) : 0.5;
  }

  private checkTopicConsistency(sentences: string[]): number {
    if (sentences.length < 2) return 1;

    // Simple topic consistency based on word overlap
    const firstSentenceWords = new Set(sentences[0].toLowerCase().split(/\s+/));
    let consistencyScore = 0;

    for (let i = 1; i < sentences.length; i++) {
      const currentWords = new Set(sentences[i].toLowerCase().split(/\s+/));
      const overlap = [...firstSentenceWords].filter((word) =>
        currentWords.has(word),
      );
      consistencyScore += overlap.length / Math.max(firstSentenceWords.size, 1);
    }

    return Math.min(consistencyScore / (sentences.length - 1), 1);
  }

  private checkQuestionCompleteness(content: string, prompt: string): number {
    const questionWords = [
      'what',
      'how',
      'why',
      'when',
      'where',
      'who',
      'which',
    ];
    const hasQuestions = questionWords.some((word) =>
      prompt.toLowerCase().includes(word),
    );

    if (!hasQuestions) return 1;

    // Check if content addresses the questions
    const promptQuestions = prompt
      .split(/[.!?]+/)
      .filter((s) =>
        questionWords.some((word) => s.toLowerCase().includes(word)),
      );

    if (promptQuestions.length === 0) return 1;

    let answeredQuestions = 0;
    for (const question of promptQuestions) {
      const questionWords = question.toLowerCase().split(/\s+/);
      const hasRelevantContent = questionWords.some(
        (word) => content.toLowerCase().includes(word) && word.length > 3,
      );
      if (hasRelevantContent) answeredQuestions++;
    }

    return answeredQuestions / promptQuestions.length;
  }

  private checkTaskFulfillment(content: string, prompt: string): number {
    const taskWords = [
      'write',
      'create',
      'describe',
      'explain',
      'analyze',
      'compare',
      'list',
    ];
    const hasTask = taskWords.some((word) =>
      prompt.toLowerCase().includes(word),
    );

    if (!hasTask) return 1;

    // Check if content fulfills the task
    const contentLength = content.split(/\s+/).length;
    const promptLength = prompt.split(/\s+/).length;

    // Content should be substantially longer than prompt for most tasks
    return Math.min(contentLength / (promptLength * 2), 1);
  }

  private hasIntroduction(content: string): boolean {
    const introWords = ['introduction', 'first', 'initially', 'begin', 'start'];
    const firstSentence = content.split(/[.!?]+/)[0].toLowerCase();
    return introWords.some((word) => firstSentence.includes(word));
  }

  private hasConclusion(content: string): boolean {
    const conclusionWords = [
      'conclusion',
      'finally',
      'in summary',
      'to conclude',
      'overall',
    ];
    const lastSentence = content
      .split(/[.!?]+/)
      .slice(-1)[0]
      .toLowerCase();
    return conclusionWords.some((word) => lastSentence.includes(word));
  }

  private checkLogicalProgression(sentences: string[]): number {
    if (sentences.length < 3) return 0.5;

    // Check for logical progression indicators
    const progressionWords = [
      'first',
      'second',
      'third',
      'next',
      'then',
      'finally',
      'moreover',
      'furthermore',
    ];
    let progressionCount = 0;

    for (const sentence of sentences) {
      if (
        progressionWords.some((word) => sentence.toLowerCase().includes(word))
      ) {
        progressionCount++;
      }
    }

    return Math.min(progressionCount / sentences.length, 1);
  }

  private calculateRepetitionScore(words: string[]): number {
    if (words.length === 0) return 0;

    const wordCounts = new Map<string, number>();
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }

    const maxRepetition = Math.max(...wordCounts.values());
    const repetitionRatio = maxRepetition / words.length;

    // Lower repetition is better (closer to 1)
    return Math.max(1 - repetitionRatio, 0);
  }
}
