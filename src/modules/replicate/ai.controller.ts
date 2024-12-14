import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReplicateService } from './replicate.service';

@Controller('ai')
export class AIController {
    constructor(private readonly replicateService: ReplicateService) {}

    /**
     * Endpoint to get a response from the meta-llama model.
     * @param prompt - The input prompt for the model.
     * @returns The model's response.
     */
    @ApiOperation({ summary: 'Get the response' })
    @ApiResponse({ status: 200, description: 'meta-llam-response' })
    @Get('meta-llama-response')

    async getMetaLlamaResponse(@Query('prompt') prompt: string): Promise<string> {
        if (!prompt) {
            throw new BadRequestException('Prompt is required');
        }
        return this.replicateService.generateResponse(prompt);
    }
    
}