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

export interface TextAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  uniqueWords: number;
  vocabularyDiversity: number;
}

export interface MetricWeights {
  coherence: number;
  completeness: number;
  length: number;
  structure: number;
  vocabulary: number;
}
