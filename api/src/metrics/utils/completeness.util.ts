import { TextAnalysisUtil } from './text-analysis.util';

export class CompletenessUtil {
  static calculateCompletenessScore(content: string, prompt: string): number {
    if (!content.trim() || !prompt.trim()) return 0;

    const keywordCoverage = this.calculateKeywordCoverage(content, prompt);
    const questionScore = this.calculateQuestionCompleteness(content, prompt);
    const taskScore = this.calculateTaskFulfillment(content, prompt);

    return keywordCoverage * 0.4 + questionScore * 0.3 + taskScore * 0.3;
  }

  private static calculateKeywordCoverage(
    content: string,
    prompt: string,
  ): number {
    const promptWords = TextAnalysisUtil.extractKeywords(prompt);
    const contentWords = TextAnalysisUtil.extractKeywords(content);

    const coveredKeywords = promptWords.filter((keyword) =>
      contentWords.some(
        (word) => word.includes(keyword) || keyword.includes(word),
      ),
    );

    return coveredKeywords.length / Math.max(promptWords.length, 1);
  }

  private static calculateQuestionCompleteness(
    content: string,
    prompt: string,
  ): number {
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

  private static calculateTaskFulfillment(
    content: string,
    prompt: string,
  ): number {
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

    const contentLength = content.split(/\s+/).length;
    const promptLength = prompt.split(/\s+/).length;

    return Math.min(contentLength / (promptLength * 2), 1);
  }
}
