import { TextAnalysisUtil } from './text-analysis.util';

export class VocabularyUtil {
  static calculateVocabularyScore(content: string): number {
    if (!content.trim()) return 0;

    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const vocabularyDiversity = uniqueWords.size / words.length;

    const sophisticationScore = this.calculateSophisticationScore(words);
    const repetitionScore = this.calculateRepetitionScore(words);

    return (
      vocabularyDiversity * 0.4 +
      sophisticationScore * 0.3 +
      repetitionScore * 0.3
    );
  }

  private static calculateSophisticationScore(words: string[]): number {
    const sophisticatedWords = words.filter(
      (word) => word.length > 6 && !TextAnalysisUtil.isCommonWord(word),
    );
    return sophisticatedWords.length / words.length;
  }

  private static calculateRepetitionScore(words: string[]): number {
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
