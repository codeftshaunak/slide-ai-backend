import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReplicateService {
    private readonly logger = new Logger(ReplicateService.name);
    private readonly baseUrl = 'https://api.replicate.com/v1/predictions';
    private readonly replicateToken = process.env.REPLICATE_API_TOKEN;

    constructor() {
        if (!this.replicateToken) {
            this.logger.error('REPLICATE_API_TOKEN is not defined in environment variables');
            throw new Error('Missing Replicate API token');
        }
    }

    async generateResponse(prompt: string): Promise<string> {
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            throw new Error('Invalid prompt provided');
        }

        try {
            const model = "meta/meta-llama-3-8b-instruct";
            this.logger.log(`Starting prediction with model: ${model}`);
            this.logger.debug(`Prompt: ${prompt}`);

            interface StartResponse {
                urls: {
                    stream: string; // URL for streaming output
                };
            }

            const startResponse = await axios.post<StartResponse>(
                this.baseUrl,
                {
                    model,
                    input: {
                        prompt,
                        max_new_tokens: 512,
                        prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
                    },
                    stream: true, // Enable streaming if supported
                },
                {
                    headers: {
                        Authorization: `Token ${this.replicateToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(startResponse);


            // Now TypeScript knows that startResponse.data.urls exists
            const predictionUrl = startResponse.data.urls.stream;

            this.logger.log(`Prediction started. Streaming URL: ${predictionUrl}`);

            // Step 2: Return Stream URL
            return predictionUrl;
        } catch (error) {
            // if (axios.isAxiosError(error)) {
            //     this.logger.error('Axios error occurred', error.response?.data || error.message);
            // } else {
            //     this.logger.error('Unexpected error', error);
            // }
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }
}
