import { TextAnalysis } from '../types/metric-types';

export class TextAnalysisUtil {
  static analyzeText(content: string): TextAnalysis {
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

  static splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter((s) => s.trim());
  }

  static extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter((word) => !this.isCommonWord(word));
  }

  static isCommonWord(word: string): boolean {
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
}
