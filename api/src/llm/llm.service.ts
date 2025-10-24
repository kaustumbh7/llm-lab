import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LLMParameters {
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  model: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(
    prompt: string,
    parameters: LLMParameters,
  ): Promise<LLMResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: parameters.model,
        generationConfig: {
          temperature: parameters.temperature,
          topP: parameters.topP,
          topK: parameters.topK,
          maxOutputTokens: parameters.maxTokens,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();

      // Estimate tokens based on content length
      const estimatedTokens = Math.ceil(content.length / 4);

      return {
        content,
        usage: {
          promptTokens: Math.ceil(prompt.length / 4),
          completionTokens: estimatedTokens,
          totalTokens: Math.ceil(prompt.length / 4) + estimatedTokens,
        },
      };
    } catch (error) {
      this.logger.error('Error generating LLM response:', error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
