export interface Experiment {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  temperatureMin: number;
  temperatureMax: number;
  temperatureStep: number;
  topPMin: number;
  topPMax: number;
  topPStep: number;
  topKMin: number;
  topKMax: number;
  topKStep: number;
  maxTokensMin: number;
  maxTokensMax: number;
  maxTokensStep: number;
}

export interface ExperimentResponse {
  id: string;
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  content: string;
  metrics?: {
    overallScore: number;
    coherenceScore: number;
    completenessScore: number;
    lengthScore: number;
    structureScore: number;
    vocabularyScore: number;
  };
}

export interface ExperimentWithResponses extends Experiment {
  responses?: ExperimentResponse[];
}

export interface ExperimentsResponse {
  experiments: Experiment[];
}
