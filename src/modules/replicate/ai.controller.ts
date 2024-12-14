import { Controller, Get, Query } from '@nestjs/common';
import { ReplicateService } from './replicate.service';

@Controller('ai')
export class AIController {
  constructor(private readonly replicateService: ReplicateService) {}

  @Get('llama')
  async getMetaLlamaResponse(@Query('prompt') prompt: string) {
    return {
      input: prompt,
      output: await this.replicateService.generateResponse(prompt),
    };
  }
}
