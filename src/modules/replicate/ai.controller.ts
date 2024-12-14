import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReplicateDtos } from 'src/common/dto/replicate-response.dto';
import { ReplicateService } from './replicate.service';

@Controller('ai')
export class AIController {
  constructor(private readonly replicateService: ReplicateService) {}

  @ApiOperation({ summary: 'Get the response' })
  @ApiResponse({ status: 200, description: 'Meta Llama Response' })
  @Get('meta-llama-response')
  async getMetaLlamaResponse(@Query('prompt') prompt: string): Promise<ReplicateDtos<string>> {
    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }
    return this.replicateService.generateResponse(prompt);
  }
}
