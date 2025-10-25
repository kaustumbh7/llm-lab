import { Body, Controller, Get, Post } from '@nestjs/common';

import { LLMParameters, LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('test')
  async testLLM(
    @Body() body: { prompt: string; parameters?: Partial<LLMParameters> },
  ) {
    const defaultParams: LLMParameters = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxTokens: 200,
      model: 'gemini-2.5-flash-lite',
    };

    const parameters = { ...defaultParams, ...body.parameters };

    try {
      const response = await this.llmService.generateResponse(
        body.prompt,
        parameters,
      );
      return {
        success: true,
        prompt: body.prompt,
        parameters,
        response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('rate-limiter-status')
  getRateLimiterStatus() {
    return {
      success: true,
      status: this.llmService.getRateLimiterStatus(),
    };
  }
}
