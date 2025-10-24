import { TextAnalysisUtil } from './text-analysis.util';

export class CoherenceUtil {
  static calculateCoherenceScore(content: string): number {
    if (!content.trim()) return 0;

    const sentences = TextAnalysisUtil.splitIntoSentences(content);
    if (sentences.length < 2) return 0.5;

    let coherenceScore = 0;

    // Check for logical connectors
    const connectorScore = this.calculateConnectorScore(
      content,
      sentences.length,
    );
    coherenceScore += connectorScore;

    // Check for pronoun consistency
    const pronounScore = this.calculatePronounConsistency(content);
    coherenceScore += pronounScore * 0.2;

    // Check for topic consistency
    const topicScore = this.calculateTopicConsistency(sentences);
    coherenceScore += topicScore * 0.5;

    return Math.min(coherenceScore, 1);
  }

  private static calculateConnectorScore(
    content: string,
    sentenceCount: number,
  ): number {
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

    return Math.min(connectorCount / sentenceCount, 0.3);
  }

  private static calculatePronounConsistency(content: string): number {
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

  private static calculateTopicConsistency(sentences: string[]): number {
    if (sentences.length < 2) return 1;

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
}
