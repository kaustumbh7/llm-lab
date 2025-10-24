export interface ExperimentParameters {
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
  model: string;
}
