import { MetricWeights } from '../types/metric-types';

/**
 * Default weights for calculating overall score
 * These weights determine the relative importance of each metric
 * All weights should sum to 1.0 for proper normalization
 */
export const DEFAULT_METRIC_WEIGHTS: MetricWeights = {
  coherence: 0.2, // 20% - Logical flow and consistency
  completeness: 0.3, // 30% - How well response addresses the prompt
  length: 0.2, // 20% - Appropriate response length
  structure: 0.15, // 15% - Paragraph structure and organization
  vocabulary: 0.15, // 15% - Vocabulary diversity and sophistication
};
