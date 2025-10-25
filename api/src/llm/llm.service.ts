import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RateLimiterService } from './rate-limiter.service';

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

  constructor(
    private configService: ConfigService,
    private rateLimiter: RateLimiterService,
  ) {
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
      // Apply rate limiting before making request
      this.logger.debug('Applying rate limiting...');
      await this.rateLimiter.waitForRateLimit();
      this.logger.debug('Rate limiting passed, making API request');

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

      this.logger.debug(
        `Generated response with ${estimatedTokens} estimated tokens`,
      );

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

      // Check if it's a quota exceeded error
      if (error instanceof Error && error.message.includes('quota')) {
        this.logger.warn(
          'Gemini API quota exceeded. Please wait before retrying.',
        );
        throw new Error(
          'API quota exceeded. Please wait 30 seconds before retrying.',
        );
      }

      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes('429')) {
        this.logger.warn(
          'Rate limit exceeded, request will be retried automatically',
        );
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get rate limiter status for monitoring
   */
  getRateLimiterStatus() {
    return this.rateLimiter.getStatus();
  }
}
