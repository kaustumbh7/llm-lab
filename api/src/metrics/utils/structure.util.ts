import { TextAnalysisUtil } from './text-analysis.util';

export class StructureUtil {
  static calculateStructureScore(content: string): number {
    if (!content.trim()) return 0;

    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());
    const sentences = TextAnalysisUtil.splitIntoSentences(content);

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
    const progressionScore = this.calculateLogicalProgression(sentences);
    structureScore += progressionScore * 0.3;

    return Math.min(structureScore, 1);
  }

  private static hasIntroduction(content: string): boolean {
    const introWords = ['introduction', 'first', 'initially', 'begin', 'start'];
    const firstSentence = content.split(/[.!?]+/)[0].toLowerCase();
    return introWords.some((word) => firstSentence.includes(word));
  }

  private static hasConclusion(content: string): boolean {
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

  private static calculateLogicalProgression(sentences: string[]): number {
    if (sentences.length < 3) return 0.5;

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
}
