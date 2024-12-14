import { ApiProperty } from '@nestjs/swagger';

export class ReplicateDtos<T> {
  @ApiProperty({ example: 200, description: 'Status of API response' })
  status: number;

  @ApiProperty({ example: 'Response generated successfully', description: 'Response message from Replicate' })
  message: string;

  @ApiProperty({ example: 'Hi, my name is...', description: 'Generated response data' })
  data: T;
}
