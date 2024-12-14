import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { ReplicateService } from './replicate.service';

@Module({
  controllers: [AIController], // Registers the controller
  providers: [ReplicateService], // Registers the service
  exports: [ReplicateService], // Makes the service reusable in other modules if needed
})
export class AIIntegrationModule {}
