import { Body, Controller, Post } from '@nestjs/common';

import { LLMParameters, LlmService } from './llm.service';

@Controller()
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('test-llm')
  async testLLM(
    @Body() body: { prompt: string; parameters?: Partial<LLMParameters> },
  ) {
    const defaultParams: LLMParameters = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxTokens: 200,
      model: 'gemini-2.5-flash',
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
}
