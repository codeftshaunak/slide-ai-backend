import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ReplicateDtos } from 'src/common/dto/replicate-response.dto';
const Replicate = require('replicate');

// Load environment variables
dotenv.config();

// Interfaces for input and output structure
interface StartPredictionResponse {
    urls: {
        get: string; // URL to poll for prediction status
    };
}

interface PredictionStatusResponse {
    status: 'starting' | 'processing' | 'succeeded' | 'failed'; // Prediction status
    output?: any; // The output of the prediction if successful
}

interface ReplicateInput {
    prompt: string;
    max_new_tokens: number;
    prompt_template: string;
}

@Injectable()
export class ReplicateService {
    private readonly logger = new Logger(ReplicateService.name);
    private readonly replicateToken = process.env.REPLICATE_API_TOKEN;

    // Ensure the token is present
    constructor() {
        if (!this.replicateToken) {
            throw new Error('REPLICATE_API_TOKEN is not defined in environment variables');
        }
    }

    // Main method for generating response from Replicate
    async generateResponse(prompt: string): Promise<ReplicateDtos<string>> {
        const replicate = new Replicate({
            auth: this.replicateToken,
        });

        const input: ReplicateInput = {
            prompt,
            max_new_tokens: 512,
            prompt_template:
                "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
        };

        try {
            const output = await replicate.run('meta/meta-llama-3-8b-instruct', { input });
            const outputString = typeof output === 'string' ? output : JSON.stringify(output);

            this.logger.log('Prediction Output:', outputString);

            return {
                status: 200,
                message: 'Generated response successfully',
                data: outputString,
            };
        } catch (error) {
            this.logger.error('Error generating response:', error);
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

}
